alter table public.family_members
  add column if not exists care_profile_id uuid references public.care_profiles(id) on delete set null;

create index if not exists family_members_workspace_email_pending_idx
  on public.family_members (workspace_id, lower(email))
  where user_id is null and email is not null;

update public.family_members
set care_profile_id = (
  select care_profiles.id
  from public.care_profiles
  where care_profiles.workspace_id = public.family_members.workspace_id
    and care_profiles.owner_user_id = public.family_members.user_id
  order by care_profiles.created_at asc
  limit 1
)
where family_members.care_profile_id is null
  and family_members.user_id is not null;

create or replace function public.create_family_invite(
  target_workspace uuid,
  invite_name text,
  invite_email text,
  invite_role public.family_role default 'member'
)
returns table (
  id uuid,
  workspace_id uuid,
  user_id uuid,
  role public.family_role,
  display_name text,
  email text,
  accessible_profile_ids uuid[],
  care_profile_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(nullif(trim(invite_email), ''));
  normalized_name text := nullif(trim(invite_name), '');
  linked_user_id uuid;
  linked_profile_id uuid;
  existing_member_id uuid;
  resolved_profile_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if not public.is_family_manager(target_workspace) then
    raise exception '가족 구성원을 추가할 권한이 없습니다.';
  end if;

  if normalized_name is null then
    raise exception '이름을 입력해 주세요.';
  end if;

  if normalized_email is null then
    raise exception '이메일을 입력해 주세요.';
  end if;

  if invite_role = 'owner' then
    raise exception '가족대표 권한은 초대로 추가할 수 없습니다.';
  end if;

  select auth_users.id
  into linked_user_id
  from auth.users as auth_users
  where lower(auth_users.email) = normalized_email
  limit 1;

  if linked_user_id is not null then
    insert into public.profiles (id, display_name)
    values (linked_user_id, normalized_name)
    on conflict (id) do update
    set display_name = excluded.display_name;
  end if;

  select family_members.id, family_members.care_profile_id
  into existing_member_id, linked_profile_id
  from public.family_members
  where family_members.workspace_id = target_workspace
    and (
      (linked_user_id is not null and family_members.user_id = linked_user_id)
      or (family_members.user_id is null and lower(coalesce(family_members.email, '')) = normalized_email)
    )
  order by family_members.created_at asc
  limit 1;

  if linked_profile_id is not null then
    resolved_profile_id := linked_profile_id;

    update public.care_profiles
    set owner_user_id = linked_user_id,
        name = normalized_name
    where care_profiles.id = resolved_profile_id;
  else
    insert into public.care_profiles (
      workspace_id,
      owner_user_id,
      name,
      type,
      age_group,
      notes,
      pet_details
    )
    values (
      target_workspace,
      linked_user_id,
      normalized_name,
      'self',
      '40',
      '가족 구성원 본인의 복용 기록입니다.',
      '{}'::jsonb
    )
    returning care_profiles.id into resolved_profile_id;
  end if;

  if existing_member_id is null then
    insert into public.family_members (
      workspace_id,
      user_id,
      role,
      display_name,
      email,
      accessible_profile_ids,
      care_profile_id
    )
    values (
      target_workspace,
      linked_user_id,
      invite_role,
      normalized_name,
      normalized_email,
      array[resolved_profile_id],
      resolved_profile_id
    )
    returning family_members.id into existing_member_id;
  else
    update public.family_members
    set user_id = coalesce(family_members.user_id, linked_user_id),
        role = invite_role,
        display_name = normalized_name,
        email = normalized_email,
        care_profile_id = resolved_profile_id,
        accessible_profile_ids = (
          select array_agg(distinct profile_id)
          from unnest(coalesce(family_members.accessible_profile_ids, '{}') || array[resolved_profile_id]) as profile_id
        )
    where family_members.id = existing_member_id;
  end if;

  return query
  select
    family_members.id,
    family_members.workspace_id,
    family_members.user_id,
    family_members.role,
    family_members.display_name,
    family_members.email,
    family_members.accessible_profile_ids,
    family_members.care_profile_id
  from public.family_members
  where family_members.id = existing_member_id;
end;
$$;

grant execute on function public.create_family_invite(uuid, text, text, public.family_role) to authenticated;

create or replace function public.ensure_personal_workspace()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_profile public.profiles%rowtype;
  auth_display_name text;
  auth_email text;
  normalized_email text;
  resolved_workspace_id uuid;
  resolved_member_id uuid;
  resolved_member_role public.family_role;
  linked_profile_id uuid;
  self_profile_id uuid;
begin
  if current_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select
    coalesce(
      raw_user_meta_data->>'full_name',
      raw_user_meta_data->>'name',
      email,
      '가족 구성원'
    ),
    email
  into auth_display_name, auth_email
  from auth.users
  where id = current_user_id;

  normalized_email := lower(nullif(auth_email, ''));

  insert into public.profiles (id, display_name)
  values (current_user_id, coalesce(auth_display_name, '가족 구성원'))
  on conflict (id) do update
  set display_name = excluded.display_name;

  select *
  into current_profile
  from public.profiles
  where id = current_user_id;

  select family_members.id,
         family_members.workspace_id,
         family_members.role,
         family_members.care_profile_id
  into resolved_member_id,
       resolved_workspace_id,
       resolved_member_role,
       linked_profile_id
  from public.family_members
  join public.family_workspaces on family_workspaces.id = family_members.workspace_id
  where family_members.user_id = current_user_id
  order by
    (family_workspaces.owner_user_id = current_user_id and family_members.role = 'owner') asc,
    family_members.created_at asc
  limit 1;

  if resolved_workspace_id is null and normalized_email is not null then
    select family_members.id,
           family_members.workspace_id,
           family_members.role,
           family_members.care_profile_id
    into resolved_member_id,
         resolved_workspace_id,
         resolved_member_role,
         linked_profile_id
    from public.family_members
    where family_members.user_id is null
      and lower(coalesce(family_members.email, '')) = normalized_email
    order by family_members.created_at asc
    limit 1;

    if resolved_member_id is not null then
      update public.family_members
      set user_id = current_user_id,
          display_name = coalesce(nullif(display_name, ''), current_profile.display_name),
          email = auth_email
      where family_members.id = resolved_member_id;
    end if;
  end if;

  if resolved_workspace_id is null then
    insert into public.family_workspaces (name, owner_user_id)
    values (
      format('%s 가족 약 관리', coalesce(nullif(current_profile.display_name, ''), '우리 가족')),
      current_user_id
    )
    returning id into resolved_workspace_id;

    insert into public.family_members (
      workspace_id,
      user_id,
      role,
      display_name,
      email,
      accessible_profile_ids
    )
    values (
      resolved_workspace_id,
      current_user_id,
      'owner',
      coalesce(nullif(current_profile.display_name, ''), '가족대표'),
      auth_email,
      '{}'
    )
    returning id, role, care_profile_id
    into resolved_member_id, resolved_member_role, linked_profile_id;
  end if;

  if linked_profile_id is not null then
    update public.care_profiles
    set owner_user_id = current_user_id,
        name = coalesce(nullif(name, ''), current_profile.display_name)
    where care_profiles.id = linked_profile_id
    returning care_profiles.id into self_profile_id;
  end if;

  if self_profile_id is null then
    select care_profiles.id
    into self_profile_id
    from public.care_profiles
    where care_profiles.workspace_id = resolved_workspace_id
      and care_profiles.owner_user_id = current_user_id
    order by care_profiles.created_at asc
    limit 1;
  end if;

  if self_profile_id is null then
    select care_profiles.id
    into self_profile_id
    from public.care_profiles
    where care_profiles.workspace_id = resolved_workspace_id
      and care_profiles.owner_user_id is null
      and care_profiles.type <> 'pet'
      and lower(regexp_replace(care_profiles.name, '\s+', '', 'g')) =
        lower(regexp_replace(current_profile.display_name, '\s+', '', 'g'))
    order by care_profiles.created_at asc
    limit 1;

    if self_profile_id is not null then
      update public.care_profiles
      set owner_user_id = current_user_id
      where care_profiles.id = self_profile_id;
    end if;
  end if;

  if self_profile_id is null then
    insert into public.care_profiles (
      workspace_id,
      owner_user_id,
      name,
      type,
      age_group,
      notes,
      pet_details
    )
    values (
      resolved_workspace_id,
      current_user_id,
      coalesce(nullif(current_profile.display_name, ''), '나'),
      'self',
      '40',
      '새 약 등록 시 상호작용을 우선 확인합니다.',
      '{}'::jsonb
    )
    returning id into self_profile_id;
  end if;

  update public.family_members
  set display_name = coalesce(nullif(display_name, ''), current_profile.display_name),
      email = coalesce(email, auth_email),
      care_profile_id = coalesce(care_profile_id, self_profile_id),
      accessible_profile_ids = (
        select array_agg(distinct profile_id)
        from unnest(coalesce(accessible_profile_ids, '{}') || array[self_profile_id]) as profile_id
      )
  where family_members.id = resolved_member_id;

  return resolved_workspace_id;
end;
$$;
