-- The original Join Us form had an interest_area field. Restore it as an optional
-- general-engagement field without changing or deleting existing registrations.
alter table public.join_us_registrations
  add column if not exists interest_area text;
