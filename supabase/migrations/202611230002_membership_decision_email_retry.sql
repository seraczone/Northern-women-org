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
