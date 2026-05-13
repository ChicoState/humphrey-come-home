-- Add scraper identity fields to shelters.
alter table public.shelters
  add column if not exists source_platform text,
  add column if not exists external_id text,
  add column if not exists source_url text;

-- Let scrapers upsert shelters by source identity while allowing manual rows.
create unique index if not exists shelters_source_platform_external_id_key
  on public.shelters (source_platform, external_id)
  where source_platform is not null and external_id is not null;
