create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  phone text not null,
  email text not null,
  occupation text not null,
  business_name text,
  business_category text,
  residential_address text not null,
  local_government text not null,
  town_city text not null,
  state text not null,
  country text not null,
  membership_type text not null check (membership_type in ('new', 'renewal')),
  membership_year integer not null,
  fee integer not null check (fee in (30000, 40000)),
  registration_date timestamptz not null default now(),
  expiry_date date not null,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending_verification','paid','failed','cancelled')),
  membership_status text not null default 'pending' check (membership_status in ('pending','active','expired','suspended','terminated')),
  payment_reference text,
  terms_accepted boolean not null default false check (terms_accepted),
  conduct_accepted boolean not null default false check (conduct_accepted),
  privacy_accepted boolean not null default false check (privacy_accepted),
  accepted_at timestamptz not null default now(),
  policy_version text not null default '2026-11-21',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_fee_matches_type check (
    (membership_type = 'new' and fee = 40000) or
    (membership_type = 'renewal' and fee = 30000)
  ),
  constraint membership_expiry_is_december check (
    expiry_date = make_date(membership_year, 12, 31)
  ),
  constraint membership_email_year_unique unique (email, membership_year)
);

create index if not exists membership_applications_created_at_idx
  on public.membership_applications (created_at desc);
create index if not exists membership_applications_year_idx
  on public.membership_applications (membership_year);
create index if not exists membership_applications_payment_status_idx
  on public.membership_applications (payment_status);

alter table public.membership_applications enable row level security;

drop policy if exists "membership_public_application_insert" on public.membership_applications;
create policy "membership_public_application_insert"
on public.membership_applications for insert to anon, authenticated
with check (
  payment_status = 'unpaid'
  and membership_status = 'pending'
  and terms_accepted = true
  and conduct_accepted = true
  and privacy_accepted = true
);

drop policy if exists "membership_admin_select" on public.membership_applications;
create policy "membership_admin_select"
on public.membership_applications for select to authenticated
using (exists (select 1 from public.admin_users where lower(email) = lower(auth.jwt() ->> 'email')));

drop policy if exists "membership_admin_update" on public.membership_applications;
create policy "membership_admin_update"
on public.membership_applications for update to authenticated
using (exists (select 1 from public.admin_users where lower(email) = lower(auth.jwt() ->> 'email')))
with check (exists (select 1 from public.admin_users where lower(email) = lower(auth.jwt() ->> 'email')));

drop policy if exists "membership_admin_delete" on public.membership_applications;
create policy "membership_admin_delete"
on public.membership_applications for delete to authenticated
using (exists (select 1 from public.admin_users where lower(email) = lower(auth.jwt() ->> 'email')));
