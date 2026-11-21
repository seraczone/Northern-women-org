-- Normalize member email addresses for duplicate detection within a membership year.
create unique index if not exists membership_applications_normalized_email_year_key
  on public.membership_applications (lower(btrim(email)), membership_year);

-- A membership cannot be activated unless an authorised administrator has verified payment.
create or replace function public.enforce_paid_membership_activation()
returns trigger
language plpgsql
as $$
begin
  if new.membership_status = 'active' and new.payment_status <> 'paid' then
    raise exception 'Membership can only be activated after payment is verified';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists membership_activation_requires_paid on public.membership_applications;
create trigger membership_activation_requires_paid
before insert or update on public.membership_applications
for each row execute function public.enforce_paid_membership_activation();
