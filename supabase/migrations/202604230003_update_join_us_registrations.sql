alter table public.join_us_registrations
  add column if not exists local_government text,
  add column if not exists occupation text,
  add column if not exists residential_address text,
  add column if not exists date_of_birth date;

update public.join_us_registrations
set
  local_government = coalesce(local_government, ''),
  occupation = coalesce(occupation, ''),
  residential_address = coalesce(residential_address, '')
where
  local_government is null
  or occupation is null
  or residential_address is null;

alter table public.join_us_registrations
  alter column local_government set not null,
  alter column occupation set not null,
  alter column residential_address set not null,
  alter column date_of_birth set not null;

alter table public.join_us_registrations
  drop column if exists interest_area;
