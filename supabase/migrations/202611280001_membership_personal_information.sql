-- Date of birth is no longer collected in the membership personal-information step.
-- Keep the column and existing historical values, but allow new applicants to omit it.
alter table public.membership_applications
  alter column date_of_birth drop not null;
