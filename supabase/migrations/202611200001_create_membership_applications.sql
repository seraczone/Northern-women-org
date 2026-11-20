create extension if not exists pgcrypto;

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  application_reference text not null unique,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  phone text not null,
  email text not null,
  residential_address text not null,
  town_city text not null,
  state text not null,
  local_government text not null,
  country text not null default 'Nigeria',
  occupation text not null,
  business_name text,
  business_category text,
  profile_description text,
  areas_of_interest text[] not null default '{}',
  membership_type text not null,
  membership_year integer not null,
  membership_fee numeric(12,2) not null,
  expiry_date date not null,
  previous_membership_year integer,
  membership_number text,
  membership_status text not null default 'submitted',
  payment_status text not null default 'pending_verification',
  payment_method text,
  transaction_reference text,
  payment_date date,
  receipt_url text,
  admin_notes text,
  accurate_information_confirmed boolean not null default false,
  terms_accepted boolean not null default false,
  calendar_acknowledged boolean not null default false,
  guidelines_accepted boolean not null default false,
  submitted_at timestamptz not null default timezone('utc', now()),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint membership_applications_type_check check (membership_type in ('new', 'renewal')),
  constraint membership_applications_fee_check check (membership_fee in (40000, 30000)),
  constraint membership_applications_status_check check (membership_status in ('submitted','pending_payment','pending_verification','pending_approval','active','expired','rejected','suspended','cancelled')),
  constraint membership_applications_payment_status_check check (payment_status in ('unpaid','pending_verification','paid','failed','cancelled'))
);

create unique index if not exists membership_applications_email_year_key
  on public.membership_applications (lower(btrim(email)), membership_year);
create unique index if not exists membership_applications_transaction_key
  on public.membership_applications (transaction_reference)
  where transaction_reference is not null;
create index if not exists membership_applications_year_idx on public.membership_applications (membership_year desc);
create index if not exists membership_applications_created_idx on public.membership_applications (created_at desc);

create table if not exists public.membership_settings (
  id boolean primary key default true,
  active_membership_year integer not null,
  new_membership_fee numeric(12,2) not null default 40000,
  renewal_membership_fee numeric(12,2) not null default 30000,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint membership_settings_singleton check (id),
  constraint membership_settings_fees_check check (new_membership_fee >= 0 and renewal_membership_fee >= 0)
);

insert into public.membership_settings (id, active_membership_year)
values (true, extract(year from now())::integer)
on conflict (id) do nothing;

create or replace function public.set_membership_application_expiry()
returns trigger language plpgsql as $$
begin
  new.membership_fee := case new.membership_type when 'new' then 40000 else 30000 end;
  new.expiry_date := make_date(new.membership_year, 12, 31);
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists membership_applications_set_derived_fields on public.membership_applications;
create trigger membership_applications_set_derived_fields
before insert or update on public.membership_applications
for each row execute function public.set_membership_application_expiry();

alter table public.membership_applications enable row level security;
alter table public.membership_settings enable row level security;

drop policy if exists "membership_public_insert" on public.membership_applications;
create policy "membership_public_insert" on public.membership_applications
for insert to public with check (
  membership_status = 'submitted'
  and payment_status = 'pending_verification'
  and approved_at is null
);

drop policy if exists "membership_admin_select" on public.membership_applications;
create policy "membership_admin_select" on public.membership_applications
for select to authenticated using (exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
));

drop policy if exists "membership_admin_update" on public.membership_applications;
create policy "membership_admin_update" on public.membership_applications
for update to authenticated using (exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
)) with check (exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
));

drop policy if exists "membership_admin_delete" on public.membership_applications;
create policy "membership_admin_delete" on public.membership_applications
for delete to authenticated using (exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
));

drop policy if exists "membership_settings_public_read" on public.membership_settings;
create policy "membership_settings_public_read" on public.membership_settings
for select to public using (true);

drop policy if exists "membership_settings_admin_update" on public.membership_settings;
create policy "membership_settings_admin_update" on public.membership_settings
for update to authenticated using (exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
)) with check (exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('membership-payment-receipts', 'membership-payment-receipts', false, 5242880, array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "membership_receipts_public_insert" on storage.objects;
create policy "membership_receipts_public_insert" on storage.objects
for insert to public with check (bucket_id = 'membership-payment-receipts');

drop policy if exists "membership_receipts_admin_select" on storage.objects;
create policy "membership_receipts_admin_select" on storage.objects
for select to authenticated using (bucket_id = 'membership-payment-receipts' and exists (
  select 1 from public.admin_users where email = auth.jwt() ->> 'email'
));
