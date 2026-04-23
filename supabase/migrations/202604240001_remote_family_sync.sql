alter table public.family_members
  alter column user_id drop not null;

alter table public.family_members
  drop constraint if exists family_members_workspace_id_user_id_key;

create unique index if not exists family_members_workspace_user_unique
  on public.family_members (workspace_id, user_id)
  where user_id is not null;

alter table public.family_members
  add column if not exists accessible_profile_ids uuid[] not null default '{}';

alter table public.care_profiles
  add column if not exists owner_user_id uuid references public.profiles(id) on delete set null;

alter table public.care_profiles
  add column if not exists pet_details jsonb not null default '{}'::jsonb;

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
  resolved_workspace_id uuid;
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

  insert into public.profiles (id, display_name)
  values (current_user_id, coalesce(auth_display_name, '가족 구성원'))
  on conflict (id) do update
  set display_name = excluded.display_name;

  select *
  into current_profile
  from public.profiles
  where id = current_user_id;

  select family_members.workspace_id
  into resolved_workspace_id
  from public.family_members
  where family_members.user_id = current_user_id
  order by family_members.created_at asc
  limit 1;

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
    );
  else
    update public.family_workspaces
    set owner_user_id = current_user_id
    where id = resolved_workspace_id;

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
    on conflict do nothing;
  end if;

  select care_profiles.id
  into self_profile_id
  from public.care_profiles
  where care_profiles.workspace_id = resolved_workspace_id
    and care_profiles.owner_user_id = current_user_id
  order by care_profiles.created_at asc
  limit 1;

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
      accessible_profile_ids = (
        select array_agg(distinct profile_id)
        from unnest(coalesce(accessible_profile_ids, '{}') || array[self_profile_id]) as profile_id
      )
  where family_members.workspace_id = resolved_workspace_id
    and user_id = current_user_id;

  return resolved_workspace_id;
end;
$$;

grant execute on function public.ensure_personal_workspace() to authenticated;
