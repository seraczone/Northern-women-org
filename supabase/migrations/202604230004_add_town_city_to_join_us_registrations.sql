alter table public.join_us_registrations
  add column if not exists town_city text;

update public.join_us_registrations
set town_city = coalesce(town_city, '')
where town_city is null;

alter table public.join_us_registrations
  alter column town_city set not null;
