-- Harden membership application submission and require an explicit admin decision.
-- This migration is intentionally limited to the membership feature.

-- Four-digit permanent member IDs: NWI-0001 through NWI-9999.
alter sequence public.nwi_membership_id_seq maxvalue 9999 no cycle;
alter table public.nwi_members
  alter column membership_id set default (
    'NWI-' || lpad(nextval('public.nwi_membership_id_seq')::text, 4, '0')
  );

-- Add a distinct declined state and an auditable admin decision.
alter table public.membership_applications
  drop constraint if exists membership_applications_payment_status_check;

alter table public.membership_applications
  add constraint membership_applications_payment_status_check
  check (payment_status in ('unpaid','pending_verification','paid','failed','cancelled','declined'));

alter table public.membership_applications
  add column if not exists payment_decision text,
  add column if not exists payment_decided_at timestamptz,
  add column if not exists payment_decided_by uuid references auth.users(id),
  add column if not exists payment_decline_reason text;

alter table public.membership_applications
  drop constraint if exists membership_applications_payment_decision_check;
alter table public.membership_applications
  add constraint membership_applications_payment_decision_check
  check (payment_decision is null or payment_decision in ('approved','declined'));

-- Only allow current-year and next-year applications at the database boundary.
create or replace function public.enforce_membership_application_rules()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  is_admin boolean;
begin
  is_admin := exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );

  if new.membership_year not between extract(year from current_date)::integer
                                  and extract(year from current_date)::integer + 1 then
    raise exception 'Membership year must be the current year or the next year';
  end if;

  if new.expiry_date <> make_date(new.membership_year, 12, 31) then
    raise exception 'Membership expiry must be 31 December of the selected year';
  end if;

  if (new.membership_type = 'new' and new.fee <> 40000)
     or (new.membership_type = 'renewal' and new.fee <> 30000) then
    raise exception 'Membership fee does not match the selected membership type';
  end if;

  if not is_admin and tg_op = 'INSERT' then
    if new.payment_status <> 'unpaid'
       or new.membership_status <> 'pending'
       or new.payment_decision is not null
       or new.payment_decided_at is not null
       or new.payment_decided_by is not null
       or new.payment_verified_at is not null
       or new.payment_verified_by is not null
       or new.admin_notes is not null
       or new.member_id is not null
       or new.membership_id is not null
       or new.receipt_path is not null
       or new.receipt_uploaded_at is not null then
      raise exception 'Applicants cannot set administrative, payment-verification, or membership-activation fields';
    end if;

    new.registration_date := now();
    new.created_at := now();
    new.updated_at := now();
    new.accepted_at := now();
  end if;

  if new.payment_status = 'paid' then
    if new.payment_decision is distinct from 'approved'
       or new.payment_decided_at is null
       or new.payment_decided_by is null
       or new.payment_verified_at is null
       or new.payment_verified_by is null
       or new.receipt_path is null then
      raise exception 'Payment can only be marked paid through an approved admin decision with a submitted receipt';
    end if;
  end if;

  if new.payment_status = 'declined' then
    if new.payment_decision is distinct from 'declined'
       or new.payment_decided_at is null
       or new.payment_decided_by is null
       or new.membership_status = 'active' then
      raise exception 'A declined payment must have an admin decision and cannot activate membership';
    end if;
  end if;

  if new.membership_status = 'active' and new.payment_status <> 'paid' then
    raise exception 'Membership can only be activated after an admin approves payment';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists membership_application_rules on public.membership_applications;
create trigger membership_application_rules
before insert or update on public.membership_applications
for each row execute function public.enforce_membership_application_rules();

-- Confirm that the uploaded object really exists before accepting its receipt path.
create or replace function public.submit_membership_payment_receipt(
  p_application_id uuid,
  p_token text,
  p_receipt_path text,
  p_payment_reference text default null
)
returns void
language plpgsql
security definer
set search_path = public, storage
as $$
begin
  if p_receipt_path is null
     or p_receipt_path not like p_application_id::text || '/' || p_token || '/%' then
    raise exception 'Invalid receipt path';
  end if;

  if not exists (
    select 1
    from storage.objects
    where bucket_id = 'membership-payment-receipts'
      and name = p_receipt_path
  ) then
    raise exception 'Uploaded receipt file was not found';
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

-- Admin-only, atomic approval/rejection. Approval verifies payment and activates membership
-- in one transaction; the existing membership-ID trigger assigns/reuses the permanent ID.
create or replace function public.admin_decide_membership_payment(
  p_application_id uuid,
  p_decision text,
  p_decline_reason text default null
)
returns public.membership_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  actor_email text := auth.jwt() ->> 'email';
  result_row public.membership_applications;
begin
  if actor_id is null or not exists (
    select 1
    from public.admin_users
    where lower(email) = lower(actor_email)
  ) then
    raise exception 'Only an authorised administrator can decide membership payments';
  end if;

  if p_decision is null or p_decision not in ('approved','declined') then
    raise exception 'Decision must be approved or declined';
  end if;

  update public.membership_applications
  set payment_decision = p_decision,
      payment_decided_at = now(),
      payment_decided_by = actor_id,
      payment_decline_reason = case
        when p_decision = 'declined' then nullif(btrim(p_decline_reason), '')
        else null
      end,
      payment_status = case
        when p_decision = 'approved' then 'paid'
        else 'declined'
      end,
      payment_verified_at = case
        when p_decision = 'approved' then now()
        else null
      end,
      payment_verified_by = case
        when p_decision = 'approved' then actor_id
        else null
      end,
      membership_status = case
        when p_decision = 'approved' then 'active'
        else 'pending'
      end
  where id = p_application_id
    and payment_status = 'pending_verification'
    and receipt_path is not null
  returning * into result_row;

  if not found then
    raise exception 'Application is not awaiting payment verification or has no receipt';
  end if;

  return result_row;
end;
$$;

revoke all on function public.admin_decide_membership_payment(uuid, text, text) from public;
grant execute on function public.admin_decide_membership_payment(uuid, text, text) to authenticated;

-- The four-digit sequence must stop rather than silently issue an ID outside the format.
comment on sequence public.nwi_membership_id_seq is
  'Permanent NWI member IDs: NWI-0001 through NWI-9999. Requires a sequence extension before the 10,000th member.';
