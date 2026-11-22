-- Membership payment workflow, private receipt storage, configurable bank details,
-- and permanent NWI member records/IDs assigned only after verified payment + activation.

create sequence if not exists public.nwi_membership_id_seq start with 1 increment by 1;

create table if not exists public.nwi_members (
  id uuid primary key default gen_random_uuid(),
  membership_id text not null unique default (
    'NWI-' || lpad(nextval('public.nwi_membership_id_seq')::text, 6, '0')
  ),
  email text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists nwi_members_normalized_email_key
  on public.nwi_members (lower(btrim(email)));

alter table public.nwi_members enable row level security;

drop policy if exists "nwi_members_admin_read" on public.nwi_members;
create policy "nwi_members_admin_read"
on public.nwi_members for select to authenticated
using (exists (
  select 1 from public.admin_users
  where lower(email) = lower(auth.jwt() ->> 'email')
));

alter table public.membership_applications
  add column if not exists member_id uuid references public.nwi_members(id),
  add column if not exists membership_id text,
  add column if not exists receipt_path text,
  add column if not exists receipt_upload_token text,
  add column if not exists receipt_uploaded_at timestamptz,
  add column if not exists payment_verified_at timestamptz,
  add column if not exists payment_verified_by uuid references auth.users(id);

create index if not exists membership_applications_membership_id_idx
  on public.membership_applications (membership_id)
  where membership_id is not null;

create table if not exists public.membership_payment_settings (
  id boolean primary key default true check (id = true),
  bank_name text not null default '',
  account_name text not null default '',
  account_number text not null default '',
  payment_instructions text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.membership_payment_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.membership_payment_settings enable row level security;

drop policy if exists "membership_payment_settings_public_read" on public.membership_payment_settings;
create policy "membership_payment_settings_public_read"
on public.membership_payment_settings for select to anon, authenticated
using (true);

drop policy if exists "membership_payment_settings_admin_update" on public.membership_payment_settings;
create policy "membership_payment_settings_admin_update"
on public.membership_payment_settings for update to authenticated
using (exists (
  select 1 from public.admin_users
  where lower(email) = lower(auth.jwt() ->> 'email')
))
with check (exists (
  select 1 from public.admin_users
  where lower(email) = lower(auth.jwt() ->> 'email')
));

create or replace function public.assign_nwi_membership_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_member_id uuid;
  resolved_membership_id text;
begin
  new.updated_at := now();

  if new.membership_status = 'active' then
    if new.payment_status <> 'paid' then
      raise exception 'Membership can only be activated after payment is verified';
    end if;

    if tg_op = 'UPDATE' and old.membership_id is not null then
      if new.membership_id is distinct from old.membership_id then
        raise exception 'A membership ID cannot be changed once assigned';
      end if;
      new.member_id := old.member_id;
      new.membership_id := old.membership_id;
    else
      -- Serialize approvals for the same email so concurrent requests cannot create duplicate member records.
      perform pg_advisory_xact_lock(hashtextextended(lower(btrim(new.email)), 0));

      -- A renewal with the same normalized email reuses the person's permanent ID.
      select id, membership_id
        into resolved_member_id, resolved_membership_id
      from public.nwi_members
      where lower(btrim(email)) = lower(btrim(new.email))
      limit 1;

      if resolved_member_id is null then
        insert into public.nwi_members (email, first_name, last_name)
        values (lower(btrim(new.email)), new.first_name, new.last_name)
        returning id, membership_id
          into resolved_member_id, resolved_membership_id;
      else
        update public.nwi_members
        set first_name = new.first_name,
            last_name = new.last_name,
            updated_at = now()
        where id = resolved_member_id;
      end if;

      new.member_id := resolved_member_id;
      new.membership_id := resolved_membership_id;
    end if;
  else
    if tg_op = 'UPDATE' and old.membership_id is not null then
      new.member_id := old.member_id;
      new.membership_id := old.membership_id;
    else
      new.member_id := null;
      new.membership_id := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists membership_activation_requires_paid on public.membership_applications;
drop trigger if exists membership_assign_nwi_id on public.membership_applications;
create trigger membership_assign_nwi_id
before insert or update on public.membership_applications
for each row execute function public.assign_nwi_membership_id();

-- A private bucket keeps receipts inaccessible to the public.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'membership-payment-receipts',
  'membership-payment-receipts',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'application/pdf'];

create or replace function public.can_upload_membership_receipt(
  p_application_id uuid,
  p_token text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.membership_applications m
    where m.id = p_application_id
      and m.receipt_upload_token = p_token
      and m.receipt_path is null
      and m.payment_status in ('unpaid', 'failed')
  );
$$;

revoke all on function public.can_upload_membership_receipt(uuid, text) from public;
grant execute on function public.can_upload_membership_receipt(uuid, text) to anon, authenticated;

drop policy if exists "membership_receipt_upload_by_token" on storage.objects;
create policy "membership_receipt_upload_by_token"
on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'membership-payment-receipts'
  and public.can_upload_membership_receipt(
    (storage.foldername(name))[1]::uuid,
    (storage.foldername(name))[2]
  )
);

drop policy if exists "membership_receipt_admin_read" on storage.objects;
create policy "membership_receipt_admin_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'membership-payment-receipts'
  and exists (
    select 1 from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  )
);

create or replace function public.submit_membership_payment_receipt(
  p_application_id uuid,
  p_token text,
  p_receipt_path text,
  p_payment_reference text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_receipt_path is null
     or p_receipt_path not like p_application_id::text || '/' || p_token || '/%' then
    raise exception 'Invalid receipt path';
  end if;

  update public.membership_applications
  set receipt_path = p_receipt_path,
      receipt_uploaded_at = now(),
      payment_reference = nullif(btrim(p_payment_reference), ''),
      payment_status = 'pending_verification',
      updated_at = now()
  where id = p_application_id
    and receipt_upload_token = p_token
    and receipt_path is null
    and payment_status in ('unpaid', 'failed');

  if not found then
    raise exception 'Application not found or receipt has already been submitted';
  end if;
end;
$$;

revoke all on function public.submit_membership_payment_receipt(uuid, text, text, text) from public;
grant execute on function public.submit_membership_payment_receipt(uuid, text, text, text) to anon, authenticated;
