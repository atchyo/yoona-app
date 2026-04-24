create table if not exists public.family_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.family_workspaces(id) on delete cascade,
  email text not null,
  display_name text not null,
  role public.family_role not null default 'member',
  status text not null default 'pending',
  invited_by uuid references auth.users(id) on delete set null,
  accepted_by uuid references auth.users(id) on delete set null,
  care_profile_id uuid references public.care_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint family_invitations_role_check check (role <> 'owner'),
  constraint family_invitations_status_check check (status in ('pending', 'accepted', 'declined', 'revoked'))
);

create unique index if not exists family_invitations_pending_email_idx
  on public.family_invitations (workspace_id, lower(email))
  where status = 'pending';

alter table public.family_invitations enable row level security;

drop policy if exists "Managers can read workspace invitations" on public.family_invitations;
create policy "Managers can read workspace invitations" on public.family_invitations
for select using (public.is_family_manager(workspace_id));

drop policy if exists "Invitees can read own invitations" on public.family_invitations;
create policy "Invitees can read own invitations" on public.family_invitations
for select using (
  lower(email) = lower(coalesce(auth.jwt()->>'email', ''))
);

create or replace function public.list_family_invitations(active_workspace_id uuid)
returns table (
  id uuid,
  workspace_id uuid,
  workspace_name text,
  email text,
  display_name text,
  role public.family_role,
  status text,
  invited_by uuid,
  accepted_by uuid,
  care_profile_id uuid,
  created_at timestamptz,
  responded_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select lower(auth.users.email)
  into current_email
  from auth.users
  where auth.users.id = auth.uid();

  return query
  select
    family_invitations.id,
    family_invitations.workspace_id,
    family_workspaces.name as workspace_name,
    family_invitations.email,
    family_invitations.display_name,
    family_invitations.role,
    family_invitations.status,
    family_invitations.invited_by,
    family_invitations.accepted_by,
    family_invitations.care_profile_id,
    family_invitations.created_at,
    family_invitations.responded_at
  from public.family_invitations
  join public.family_workspaces on family_workspaces.id = family_invitations.workspace_id
  where (
      family_invitations.workspace_id = active_workspace_id
      and public.is_family_manager(active_workspace_id)
    )
    or (
      family_invitations.status = 'pending'
      and lower(family_invitations.email) = current_email
    )
  order by family_invitations.created_at desc;
end;
$$;

grant execute on function public.list_family_invitations(uuid) to authenticated;

create or replace function public.create_family_invitation(
  target_workspace uuid,
  invite_name text,
  invite_email text,
  invite_role public.family_role default 'member'
)
returns table (
  id uuid,
  workspace_id uuid,
  workspace_name text,
  email text,
  display_name text,
  role public.family_role,
  status text,
  invited_by uuid,
  accepted_by uuid,
  care_profile_id uuid,
  created_at timestamptz,
  responded_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(nullif(trim(invite_email), ''));
  normalized_name text := nullif(trim(invite_name), '');
  linked_user_id uuid;
  existing_invitation_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if not public.is_family_manager(target_workspace) then
    raise exception '가족 초대를 만들 권한이 없습니다.';
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

  select auth.users.id
  into linked_user_id
  from auth.users
  where lower(auth.users.email) = normalized_email
  limit 1;

  if linked_user_id is not null and exists (
    select 1
    from public.family_members
    where family_members.workspace_id = target_workspace
      and family_members.user_id = linked_user_id
  ) then
    raise exception '이미 이 가족공간에 참여 중인 이메일입니다.';
  end if;

  select family_invitations.id
  into existing_invitation_id
  from public.family_invitations
  where family_invitations.workspace_id = target_workspace
    and lower(family_invitations.email) = normalized_email
    and family_invitations.status = 'pending'
  limit 1;

  if existing_invitation_id is null then
    insert into public.family_invitations (
      workspace_id,
      email,
      display_name,
      role,
      status,
      invited_by
    )
    values (
      target_workspace,
      normalized_email,
      normalized_name,
      invite_role,
      'pending',
      auth.uid()
    )
    returning family_invitations.id into existing_invitation_id;
  else
    update public.family_invitations
    set display_name = normalized_name,
        role = invite_role,
        invited_by = auth.uid(),
        created_at = now()
    where family_invitations.id = existing_invitation_id;
  end if;

  return query
  select
    family_invitations.id,
    family_invitations.workspace_id,
    family_workspaces.name as workspace_name,
    family_invitations.email,
    family_invitations.display_name,
    family_invitations.role,
    family_invitations.status,
    family_invitations.invited_by,
    family_invitations.accepted_by,
    family_invitations.care_profile_id,
    family_invitations.created_at,
    family_invitations.responded_at
  from public.family_invitations
  join public.family_workspaces on family_workspaces.id = family_invitations.workspace_id
  where family_invitations.id = existing_invitation_id;
end;
$$;

grant execute on function public.create_family_invitation(uuid, text, text, public.family_role) to authenticated;

create or replace function public.accept_family_invitation(
  invitation_id uuid,
  import_personal_records boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  auth_email text;
  current_profile public.profiles%rowtype;
  target_invitation public.family_invitations%rowtype;
  existing_member_id uuid;
  resolved_profile_id uuid;
  source_profile_id uuid;
begin
  if current_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select auth.users.email
  into auth_email
  from auth.users
  where auth.users.id = current_user_id;

  select *
  into target_invitation
  from public.family_invitations
  where family_invitations.id = invitation_id
    and family_invitations.status = 'pending'
    and lower(family_invitations.email) = lower(coalesce(auth_email, ''));

  if target_invitation.id is null then
    raise exception '수락할 가족 초대를 찾지 못했습니다.';
  end if;

  insert into public.profiles (id, display_name)
  values (current_user_id, target_invitation.display_name)
  on conflict (id) do update
  set display_name = coalesce(nullif(public.profiles.display_name, ''), excluded.display_name);

  select *
  into current_profile
  from public.profiles
  where profiles.id = current_user_id;

  select family_members.id, family_members.care_profile_id
  into existing_member_id, resolved_profile_id
  from public.family_members
  where family_members.workspace_id = target_invitation.workspace_id
    and family_members.user_id = current_user_id
  limit 1;

  if resolved_profile_id is null then
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
      target_invitation.workspace_id,
      current_user_id,
      coalesce(nullif(target_invitation.display_name, ''), nullif(current_profile.display_name, ''), '가족 구성원'),
      'self',
      '40',
      '가족 구성원 본인의 복용 기록입니다.',
      '{}'::jsonb
    )
    returning care_profiles.id into resolved_profile_id;
  else
    update public.care_profiles
    set owner_user_id = current_user_id,
        name = coalesce(nullif(target_invitation.display_name, ''), name)
    where care_profiles.id = resolved_profile_id;
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
      target_invitation.workspace_id,
      current_user_id,
      target_invitation.role,
      target_invitation.display_name,
      auth_email,
      array[resolved_profile_id],
      resolved_profile_id
    );
  else
    update public.family_members
    set role = target_invitation.role,
        display_name = target_invitation.display_name,
        email = auth_email,
        care_profile_id = coalesce(care_profile_id, resolved_profile_id),
        accessible_profile_ids = (
          select array_agg(distinct profile_id)
          from unnest(coalesce(accessible_profile_ids, '{}') || array[resolved_profile_id]) as profile_id
        )
    where family_members.id = existing_member_id;
  end if;

  if import_personal_records then
    select care_profiles.id
    into source_profile_id
    from public.care_profiles
    join public.family_workspaces on family_workspaces.id = care_profiles.workspace_id
    where care_profiles.owner_user_id = current_user_id
      and care_profiles.workspace_id <> target_invitation.workspace_id
      and family_workspaces.owner_user_id = current_user_id
    order by care_profiles.created_at asc
    limit 1;

    if source_profile_id is not null then
      insert into public.medications (
        workspace_id,
        care_profile_id,
        status,
        product_name,
        nickname,
        source,
        ingredients,
        dosage,
        instructions,
        warnings,
        interactions,
        started_at,
        review_at,
        created_by
      )
      select
        target_invitation.workspace_id,
        resolved_profile_id,
        medications.status,
        medications.product_name,
        medications.nickname,
        medications.source,
        medications.ingredients,
        medications.dosage,
        medications.instructions,
        medications.warnings,
        medications.interactions,
        medications.started_at,
        medications.review_at,
        current_user_id
      from public.medications
      where medications.care_profile_id = source_profile_id
        and not exists (
          select 1
          from public.medications as existing_medications
          where existing_medications.care_profile_id = resolved_profile_id
            and existing_medications.product_name = medications.product_name
            and existing_medications.source = medications.source
        );
    end if;
  end if;

  update public.family_invitations
  set status = 'accepted',
      accepted_by = current_user_id,
      care_profile_id = resolved_profile_id,
      responded_at = now()
  where family_invitations.id = target_invitation.id;

  return target_invitation.workspace_id;
end;
$$;

grant execute on function public.accept_family_invitation(uuid, boolean) to authenticated;

create or replace function public.decline_family_invitation(invitation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  auth_email text;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select auth.users.email into auth_email from auth.users where auth.users.id = auth.uid();

  update public.family_invitations
  set status = 'declined',
      responded_at = now()
  where family_invitations.id = invitation_id
    and family_invitations.status = 'pending'
    and lower(family_invitations.email) = lower(coalesce(auth_email, ''));
end;
$$;

grant execute on function public.decline_family_invitation(uuid) to authenticated;

create or replace function public.revoke_family_invitation(invitation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_workspace uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select family_invitations.workspace_id
  into target_workspace
  from public.family_invitations
  where family_invitations.id = invitation_id;

  if target_workspace is null then
    raise exception '가족 초대를 찾지 못했습니다.';
  end if;

  if not public.is_family_manager(target_workspace) then
    raise exception '가족 초대를 취소할 권한이 없습니다.';
  end if;

  update public.family_invitations
  set status = 'revoked',
      responded_at = now()
  where family_invitations.id = invitation_id
    and family_invitations.status = 'pending';
end;
$$;

grant execute on function public.revoke_family_invitation(uuid) to authenticated;

create or replace function public.ensure_personal_workspace(preferred_workspace_id uuid default null)
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

  insert into public.profiles (id, display_name)
  values (current_user_id, coalesce(auth_display_name, '가족 구성원'))
  on conflict (id) do update
  set display_name = coalesce(nullif(public.profiles.display_name, ''), excluded.display_name);

  select *
  into current_profile
  from public.profiles
  where id = current_user_id;

  if preferred_workspace_id is not null then
    select family_members.id,
           family_members.workspace_id,
           family_members.role,
           family_members.care_profile_id
    into resolved_member_id,
         resolved_workspace_id,
         resolved_member_role,
         linked_profile_id
    from public.family_members
    where family_members.workspace_id = preferred_workspace_id
      and family_members.user_id = current_user_id
    limit 1;
  end if;

  if resolved_workspace_id is null then
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
      (family_workspaces.owner_user_id = current_user_id and family_members.role = 'owner') desc,
      family_members.created_at asc
    limit 1;
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
        name = coalesce(nullif(name, ''), current_profile.display_name, '가족 구성원')
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
      coalesce(nullif(current_profile.display_name, ''), '가족 구성원'),
      'self',
      '40',
      '새 약 등록 시 상호작용을 우선 확인합니다.',
      '{}'::jsonb
    )
    returning id into self_profile_id;
  end if;

  update public.family_members
  set display_name = coalesce(nullif(display_name, ''), current_profile.display_name, '가족 구성원'),
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

grant execute on function public.ensure_personal_workspace(uuid) to authenticated;
