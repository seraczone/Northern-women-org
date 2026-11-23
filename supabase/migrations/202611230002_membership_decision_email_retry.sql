-- Persistent, retryable delivery state for membership approval/decline emails.
-- This migration is isolated to membership and does not alter Summit registrations.
alter table public.membership_applications
  add column if not exists decision_email_status text not null default 'pending',
  add column if not exists decision_email_attempts integer not null default 0,
  add column if not exists decision_email_started_at timestamptz,
  add column if not exists decision_email_sent_at timestamptz,
  add column if not exists decision_email_error text,
  add column if not exists decision_email_resend_id text;

alter table public.membership_applications
  drop constraint if exists membership_applications_decision_email_status_check;

alter table public.membership_applications
  add constraint membership_applications_decision_email_status_check
  check (decision_email_status in ('pending','sending','sent','failed'));

alter table public.membership_applications
  drop constraint if exists membership_applications_decision_email_attempts_check;

alter table public.membership_applications
  add constraint membership_applications_decision_email_attempts_check
  check (decision_email_attempts >= 0);

create index if not exists membership_applications_decision_email_retry_idx
  on public.membership_applications (decision_email_status, decision_email_started_at)
  where payment_decision is not null;

comment on column public.membership_applications.decision_email_status is
  'Delivery state for the one-time admin approval/decline notification. Failed and stale sending states can be retried.';

-- Do not allow public applicants to forge notification delivery state and suppress
-- the administrator's approval/decline email.
create or replace function public.guard_membership_decision_email_state()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  is_admin boolean;
begin
  is_admin := exists (
    select 1 from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );

  if not is_admin and (
    new.decision_email_status is distinct from 'pending'
    or new.decision_email_attempts is distinct from 0
    or new.decision_email_started_at is not null
    or new.decision_email_sent_at is not null
    or new.decision_email_error is not null
    or new.decision_email_resend_id is not null
  ) then
    raise exception 'Applicants cannot set membership notification delivery fields';
  end if;

  return new;
end;
$$;

drop trigger if exists membership_decision_email_state_guard on public.membership_applications;
create trigger membership_decision_email_state_guard
before insert on public.membership_applications
for each row execute function public.guard_membership_decision_email_state();
