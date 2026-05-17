do $$
begin
  if to_regclass('public.featured_event') is null then
    raise notice 'public.featured_event does not exist; skipping featured event schedule migration.';
  else
    alter table public.featured_event
      add column if not exists starts_at timestamptz,
      add column if not exists ends_at timestamptz,
      add column if not exists timezone text;

    update public.featured_event
      set timezone = 'Africa/Lagos'
      where timezone is null
        or btrim(timezone) = '';

    alter table public.featured_event
      alter column timezone set default 'Africa/Lagos';
  end if;

  if to_regclass('public.event_registration') is null then
    raise notice 'public.event_registration does not exist; skipping reminder migration.';
  else
    alter table public.event_registration
      add column if not exists featured_event_id uuid,
      add column if not exists event_start_at timestamptz,
      add column if not exists event_end_at timestamptz,
      add column if not exists event_timezone text,
      add column if not exists reminder_send_at timestamptz,
      add column if not exists reminder_sent_at timestamptz,
      add column if not exists reminder_last_error text;

    update public.event_registration
      set event_timezone = 'Africa/Lagos'
      where event_timezone is null
        or btrim(event_timezone) = '';

    if to_regclass('public.featured_event') is not null then
      with latest_featured_event as (
        select
          id,
          title,
          date,
          time,
          location,
          starts_at,
          ends_at,
          coalesce(nullif(btrim(timezone), ''), 'Africa/Lagos') as timezone
        from public.featured_event
        order by id desc
        limit 1
      )
      update public.event_registration as registration
        set featured_event_id = coalesce(registration.featured_event_id, featured.id),
            event_start_at = coalesce(registration.event_start_at, featured.starts_at),
            event_end_at = coalesce(registration.event_end_at, featured.ends_at),
            event_timezone = coalesce(nullif(btrim(registration.event_timezone), ''), featured.timezone, 'Africa/Lagos')
      from latest_featured_event as featured
      where (
          registration.featured_event_id is null
          or registration.event_start_at is null
        )
        and lower(btrim(coalesce(registration.event_name, ''))) = lower(btrim(coalesce(featured.title, '')))
        and (
          registration.event_date is null
          or featured.date is null
          or lower(btrim(registration.event_date)) = lower(btrim(featured.date))
        )
        and (
          registration.event_location is null
          or featured.location is null
          or lower(btrim(registration.event_location)) = lower(btrim(featured.location))
        );
    end if;

    alter table public.event_registration
      alter column event_timezone set default 'Africa/Lagos';

    update public.event_registration
      set reminder_send_at = event_start_at - interval '7 days'
      where event_start_at is not null
        and reminder_send_at is null;

    begin
      alter table public.event_registration
        add constraint event_registration_featured_event_id_fkey
        foreign key (featured_event_id)
        references public.featured_event (id)
        on delete set null;
    exception
      when duplicate_object then
        null;
      when undefined_table then
        raise notice 'public.featured_event does not exist; skipping event_registration.featured_event_id foreign key.';
    end;

    create index if not exists event_registration_featured_event_id_idx
      on public.event_registration (featured_event_id);

    create index if not exists event_registration_event_start_at_idx
      on public.event_registration (event_start_at);

    create index if not exists event_registration_reminder_due_idx
      on public.event_registration (reminder_send_at)
      where reminder_sent_at is null
        and event_start_at is not null;
  end if;
end;
$$;
