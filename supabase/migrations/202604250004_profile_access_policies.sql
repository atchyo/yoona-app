create or replace function public.can_manage_care_profile(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.care_profiles
    where care_profiles.id = target_profile
      and (
        public.is_family_manager(care_profiles.workspace_id)
        or care_profiles.owner_user_id = auth.uid()
        or exists (
          select 1
          from public.family_members
          where family_members.workspace_id = care_profiles.workspace_id
            and family_members.user_id = auth.uid()
            and family_members.care_profile_id = care_profiles.id
        )
      )
  );
$$;

create or replace function public.can_access_care_profile(target_profile uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.care_profiles
    where care_profiles.id = target_profile
      and (
        public.can_manage_care_profile(care_profiles.id)
        or exists (
          select 1
          from public.family_members
          where family_members.workspace_id = care_profiles.workspace_id
            and family_members.user_id = auth.uid()
            and care_profiles.id = any(coalesce(family_members.accessible_profile_ids, '{}'))
        )
      )
  );
$$;

grant execute on function public.can_manage_care_profile(uuid) to authenticated;
grant execute on function public.can_access_care_profile(uuid) to authenticated;

drop policy if exists "Members can read care profiles" on public.care_profiles;
drop policy if exists "Managers can manage care profiles" on public.care_profiles;
drop policy if exists "Authorized users can read care profiles" on public.care_profiles;
create policy "Authorized users can read care profiles" on public.care_profiles
for select using (public.can_access_care_profile(id));

drop policy if exists "Managers can insert care profiles" on public.care_profiles;
create policy "Managers can insert care profiles" on public.care_profiles
for insert with check (public.is_family_manager(workspace_id));

drop policy if exists "Managers can update care profiles" on public.care_profiles;
create policy "Managers can update care profiles" on public.care_profiles
for update using (public.is_family_manager(workspace_id)) with check (public.is_family_manager(workspace_id));

drop policy if exists "Managers can delete care profiles" on public.care_profiles;
create policy "Managers can delete care profiles" on public.care_profiles
for delete using (public.is_family_manager(workspace_id));

drop policy if exists "Members can read scans" on public.ocr_scans;
drop policy if exists "Members can create scans" on public.ocr_scans;
drop policy if exists "Authorized users can read scans" on public.ocr_scans;
create policy "Authorized users can read scans" on public.ocr_scans
for select using (public.can_access_care_profile(care_profile_id));

drop policy if exists "Authorized users can create scans" on public.ocr_scans;
create policy "Authorized users can create scans" on public.ocr_scans
for insert with check (public.can_manage_care_profile(care_profile_id) and created_by = auth.uid());

drop policy if exists "Members can read medication photos" on public.medication_photos;
drop policy if exists "Members can manage medication photos" on public.medication_photos;
drop policy if exists "Authorized users can read medication photos" on public.medication_photos;
create policy "Authorized users can read medication photos" on public.medication_photos
for select using (
  exists (
    select 1
    from public.ocr_scans
    where ocr_scans.id = medication_photos.scan_id
      and public.can_access_care_profile(ocr_scans.care_profile_id)
  )
);

drop policy if exists "Authorized users can insert medication photos" on public.medication_photos;
create policy "Authorized users can insert medication photos" on public.medication_photos
for insert with check (
  exists (
    select 1
    from public.ocr_scans
    where ocr_scans.id = medication_photos.scan_id
      and public.can_manage_care_profile(ocr_scans.care_profile_id)
  )
);

drop policy if exists "Members can read drug matches" on public.drug_database_matches;
drop policy if exists "Members can manage drug matches" on public.drug_database_matches;
drop policy if exists "Authorized users can read drug matches" on public.drug_database_matches;
create policy "Authorized users can read drug matches" on public.drug_database_matches
for select using (
  exists (
    select 1
    from public.ocr_scans
    where ocr_scans.id = drug_database_matches.scan_id
      and public.can_access_care_profile(ocr_scans.care_profile_id)
  )
);

drop policy if exists "Authorized users can insert drug matches" on public.drug_database_matches;
create policy "Authorized users can insert drug matches" on public.drug_database_matches
for insert with check (
  exists (
    select 1
    from public.ocr_scans
    where ocr_scans.id = drug_database_matches.scan_id
      and public.can_manage_care_profile(ocr_scans.care_profile_id)
  )
);

drop policy if exists "Members can read medications" on public.medications;
drop policy if exists "Members can manage medications" on public.medications;
drop policy if exists "Authorized users can read medications" on public.medications;
create policy "Authorized users can read medications" on public.medications
for select using (public.can_access_care_profile(care_profile_id));

drop policy if exists "Authorized users can insert medications" on public.medications;
create policy "Authorized users can insert medications" on public.medications
for insert with check (public.can_manage_care_profile(care_profile_id) and created_by = auth.uid());

drop policy if exists "Authorized users can update medications" on public.medications;
create policy "Authorized users can update medications" on public.medications
for update using (public.can_manage_care_profile(care_profile_id)) with check (public.can_manage_care_profile(care_profile_id));

drop policy if exists "Authorized users can delete medications" on public.medications;
create policy "Authorized users can delete medications" on public.medications
for delete using (public.can_manage_care_profile(care_profile_id));

drop policy if exists "Members can read temporary medications" on public.temporary_medications;
drop policy if exists "Members can manage temporary medications" on public.temporary_medications;
drop policy if exists "Authorized users can read temporary medications" on public.temporary_medications;
create policy "Authorized users can read temporary medications" on public.temporary_medications
for select using (public.can_access_care_profile(care_profile_id));

drop policy if exists "Authorized users can insert temporary medications" on public.temporary_medications;
create policy "Authorized users can insert temporary medications" on public.temporary_medications
for insert with check (public.can_manage_care_profile(care_profile_id) and created_by = auth.uid());

drop policy if exists "Authorized users can update temporary medications" on public.temporary_medications;
create policy "Authorized users can update temporary medications" on public.temporary_medications
for update using (public.can_manage_care_profile(care_profile_id)) with check (public.can_manage_care_profile(care_profile_id));

drop policy if exists "Authorized users can delete temporary medications" on public.temporary_medications;
create policy "Authorized users can delete temporary medications" on public.temporary_medications
for delete using (public.can_manage_care_profile(care_profile_id));
