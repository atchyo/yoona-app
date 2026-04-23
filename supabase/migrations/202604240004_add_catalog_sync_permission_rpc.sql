create or replace function public.can_sync_drug_catalog()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where user_id = auth.uid()
      and role in ('owner', 'manager')
  );
$$;

grant execute on function public.can_sync_drug_catalog() to authenticated;
