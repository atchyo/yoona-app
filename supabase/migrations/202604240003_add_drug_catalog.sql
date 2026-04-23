create extension if not exists "pg_trgm";

create table if not exists public.drug_catalog_items (
  id uuid primary key default gen_random_uuid(),
  source public.drug_source not null,
  source_record_id text not null,
  category text not null check (category in ('drug', 'supplement')),
  product_name text not null,
  normalized_product_name text not null,
  manufacturer text,
  normalized_manufacturer text not null default '',
  ingredients jsonb not null default '[]'::jsonb,
  dosage_form text,
  efficacy text,
  usage text,
  warnings text[] not null default '{}',
  interactions text[] not null default '{}',
  search_text text not null default '',
  search_compact text not null default '',
  source_payload jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, source_record_id)
);

create table if not exists public.drug_catalog_sync_runs (
  id uuid primary key default gen_random_uuid(),
  source public.drug_source not null,
  status text not null check (status in ('running', 'completed', 'failed')),
  fetched_count integer not null default 0,
  upserted_count integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists drug_catalog_items_source_category_idx
  on public.drug_catalog_items (source, category);

create index if not exists drug_catalog_items_product_name_idx
  on public.drug_catalog_items (normalized_product_name);

create index if not exists drug_catalog_items_search_text_trgm_idx
  on public.drug_catalog_items using gin (search_text gin_trgm_ops);

create index if not exists drug_catalog_items_search_compact_trgm_idx
  on public.drug_catalog_items using gin (search_compact gin_trgm_ops);

alter table public.drug_catalog_items enable row level security;
alter table public.drug_catalog_sync_runs enable row level security;

drop policy if exists "Authenticated users can read drug catalog" on public.drug_catalog_items;
create policy "Authenticated users can read drug catalog" on public.drug_catalog_items
for select using (auth.role() = 'authenticated');

drop policy if exists "Managers can read sync runs" on public.drug_catalog_sync_runs;
create policy "Managers can read sync runs" on public.drug_catalog_sync_runs
for select using (
  exists (
    select 1
    from public.family_members
    where family_members.user_id = auth.uid()
      and family_members.role in ('owner', 'manager')
  )
);
