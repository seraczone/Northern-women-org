-- Fix the public membership year at 2027 and require renewal code verification.
alter table public.membership_applications
  add column if not exists membership_code text;

comment on column public.membership_applications.membership_code is
  'Transient membership code used to verify renewals. Cleared before an application is stored.';

create or replace function public.verify_nwi_membership_code(
  p_membership_code text,
  p_email text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.nwi_members
    where upper(btrim(membership_id)) = upper(btrim(coalesce(p_membership_code, '')))
      and lower(btrim(email)) = lower(btrim(coalesce(p_email, '')))
      and btrim(coalesce(p_membership_code, '')) <> ''
      and btrim(coalesce(p_email, '')) <> ''
  );
$$;

revoke all on function public.verify_nwi_membership_code(text, text) from public;
grant execute on function public.verify_nwi_membership_code(text, text) to anon, authenticated;

create or replace function public.enforce_membership_code_and_year()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.membership_year <> 2027 then
      raise exception 'Membership year is fixed at 2027';
    end if;

    if new.membership_type = 'renewal' then
      if not public.verify_nwi_membership_code(new.membership_code, new.email) then
        raise exception 'Membership code does not match an NWI member with this email address';
      end if;
    elsif nullif(btrim(new.membership_code), '') is not null then
      raise exception 'A membership code is only accepted for a renewal';
    end if;

    -- Validate the code without retaining it in the application record.
    new.membership_code := null;
  end if;

  return new;
end;
$$;

drop trigger if exists membership_application_code_and_year_guard on public.membership_applications;
create trigger membership_application_code_and_year_guard
before insert on public.membership_applications
for each row execute function public.enforce_membership_code_and_year();
