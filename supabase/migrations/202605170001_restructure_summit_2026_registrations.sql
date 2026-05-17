create extension if not exists pgcrypto;

alter table public.summit_2026_registrations
  alter column first_name drop not null,
  alter column last_name drop not null,
  alter column address drop not null,
  alter column occupation drop not null,
  alter column country set default 'Nigeria';

alter table public.summit_2026_registrations
  add column if not exists full_name text,
  add column if not exists city text,
  add column if not exists member_status boolean,
  add column if not exists membership_id text,
  add column if not exists ticket_type text,
  add column if not exists quantity integer,
  add column if not exists total_amount numeric(12, 2),
  add column if not exists registration_reference text,
  add column if not exists payment_status text,
  add column if not exists transaction_reference text,
  add column if not exists receipt_url text,
  add column if not exists payment_date date,
  add column if not exists payment_method text,
  add column if not exists summit_interest text,
  add column if not exists attended_before boolean,
  add column if not exists business_owner boolean,
  add column if not exists business_name text,
  add column if not exists industry text,
  add column if not exists networking_interest boolean,
  add column if not exists networking_directory boolean,
  add column if not exists dietary_requirements text,
  add column if not exists emergency_contact text,
  add column if not exists referral_source text,
  add column if not exists media_consent boolean,
  add column if not exists agreement boolean,
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

update public.summit_2026_registrations
set
  full_name = trim(concat_ws(' ', coalesce(first_name, ''), coalesce(last_name, ''))),
  city = coalesce(city, address),
  ticket_type = coalesce(ticket_type, 'standard'),
  quantity = coalesce(quantity, 1),
  total_amount = coalesce(total_amount, 70000),
  payment_status = coalesce(nullif(payment_status, ''), 'pending'),
  country = coalesce(nullif(country, ''), 'Nigeria'),
  summit_interest = coalesce(summit_interest, expectations),
  business_name = coalesce(business_name, organization),
  referral_source = coalesce(nullif(referral_source, ''), 'Other'),
  agreement = coalesce(agreement, false),
  media_consent = coalesce(media_consent, false)
where
  full_name is null
  or btrim(full_name) = ''
  or city is null
  or ticket_type is null
  or quantity is null
  or total_amount is null
  or payment_status is null
  or country is null
  or summit_interest is null
  or business_name is null
  or referral_source is null
  or agreement is null
  or media_consent is null;

with numbered_rows as (
  select
    id,
    row_number() over (order by created_at, id) as seq
  from public.summit_2026_registrations
  where registration_reference is null or btrim(registration_reference) = ''
)
update public.summit_2026_registrations as registrations
set registration_reference = 'NWS2026-' || lpad(numbered_rows.seq::text, 5, '0')
from numbered_rows
where registrations.id = numbered_rows.id;

alter table public.summit_2026_registrations
  alter column full_name set not null,
  alter column ticket_type set default 'standard',
  alter column quantity set default 1,
  alter column registration_reference set not null,
  alter column payment_status set default 'pending',
  alter column payment_status set not null;

alter table public.summit_2026_registrations
  drop constraint if exists summit_2026_registrations_payment_status_check,
  drop constraint if exists summit_2026_registrations_ticket_type_check,
  drop constraint if exists summit_2026_registrations_payment_method_check,
  drop constraint if exists summit_2026_registrations_quantity_check,
  drop constraint if exists summit_2026_registrations_total_amount_check;

alter table public.summit_2026_registrations
  add constraint summit_2026_registrations_payment_status_check
    check (payment_status in ('pending', 'approved', 'rejected')),
  add constraint summit_2026_registrations_ticket_type_check
    check (ticket_type in ('standard', 'group', 'vip')),
  add constraint summit_2026_registrations_payment_method_check
    check (
      payment_method is null
      or payment_method in ('Bank Transfer', 'Bank Deposit', 'POS Transfer')
    ),
  add constraint summit_2026_registrations_quantity_check
    check (quantity between 1 and 20),
  add constraint summit_2026_registrations_total_amount_check
    check (total_amount is null or total_amount >= 0);

create unique index if not exists summit_2026_registrations_registration_reference_key
  on public.summit_2026_registrations (registration_reference);

create unique index if not exists summit_2026_registrations_transaction_reference_key
  on public.summit_2026_registrations (transaction_reference)
  where transaction_reference is not null;

create index if not exists summit_2026_registrations_payment_status_idx
  on public.summit_2026_registrations (payment_status);

create index if not exists summit_2026_registrations_ticket_type_idx
  on public.summit_2026_registrations (ticket_type);

drop trigger if exists summit_2026_registrations_set_updated_at
  on public.summit_2026_registrations;

create trigger summit_2026_registrations_set_updated_at
before update on public.summit_2026_registrations
for each row
execute function public.set_updated_at();

alter table public.summit_2026_registrations enable row level security;

drop policy if exists "summit_2026_public_insert" on public.summit_2026_registrations;
create policy "summit_2026_public_insert"
on public.summit_2026_registrations
for insert
to public
with check (true);

drop policy if exists "summit_2026_admin_select" on public.summit_2026_registrations;
create policy "summit_2026_admin_select"
on public.summit_2026_registrations
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "summit_2026_admin_update" on public.summit_2026_registrations;
create policy "summit_2026_admin_update"
on public.summit_2026_registrations
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "summit_2026_admin_delete" on public.summit_2026_registrations;
create policy "summit_2026_admin_delete"
on public.summit_2026_registrations
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'payment-receipts',
  'payment-receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "payment_receipts_public_insert" on storage.objects;
create policy "payment_receipts_public_insert"
on storage.objects
for insert
to public
with check (bucket_id = 'payment-receipts');

drop policy if exists "payment_receipts_admin_select" on storage.objects;
create policy "payment_receipts_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-receipts'
  and exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "payment_receipts_admin_update" on storage.objects;
create policy "payment_receipts_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-receipts'
  and exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
)
with check (
  bucket_id = 'payment-receipts'
  and exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "payment_receipts_admin_delete" on storage.objects;
create policy "payment_receipts_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-receipts'
  and exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);
