create extension if not exists pgcrypto;
do $$
begin
  if to_regclass('public.event_registration') is null then
    raise notice 'public.event_registration does not exist; skipping QR field migration.';
  else
    alter table public.event_registration
      add column if not exists registration_code text,
      add column if not exists event_date text,
      add column if not exists event_time text,
      add column if not exists event_location text,
      add column if not exists checked_in_at timestamptz;

    alter table public.event_registration
      alter column registration_code set default (
        'NWI-EVT-' || upper(replace(gen_random_uuid()::text, '-', ''))
      );

    update public.event_registration
      set registration_code = 'NWI-EVT-' || upper(replace(gen_random_uuid()::text, '-', ''))
      where registration_code is null
        or btrim(registration_code) = '';

    create unique index if not exists event_registration_registration_code_key
      on public.event_registration (registration_code);

    alter table public.event_registration
      alter column registration_code set not null;
  end if;
end;
$$;
