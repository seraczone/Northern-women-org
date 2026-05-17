do $$
declare
  existing_job_id bigint;
begin
  if to_regclass('cron.job') is not null then
    for existing_job_id in
      select jobid
      from cron.job
      where jobname = 'send-event-reminders-hourly'
    loop
      perform cron.unschedule(existing_job_id);
    end loop;
  end if;
end;
$$;
delete from public.internal_app_secrets
where key in ('supabase_project_url', 'event_reminder_cron_secret');
drop function if exists public.invoke_send_event_reminders_job();
drop table if exists public.internal_app_secrets;
do $$
begin
  if to_regclass('public.event_registration') is not null then
    drop index if exists public.event_registration_reminder_due_idx;
    drop index if exists public.event_registration_event_start_at_idx;
    drop index if exists public.event_registration_featured_event_id_idx;

    alter table public.event_registration
      drop constraint if exists event_registration_featured_event_id_fkey;

    alter table public.event_registration
      drop column if exists reminder_last_error,
      drop column if exists reminder_sent_at,
      drop column if exists reminder_send_at,
      drop column if exists event_timezone,
      drop column if exists event_end_at,
      drop column if exists event_start_at,
      drop column if exists featured_event_id;
  end if;

  if to_regclass('public.featured_event') is not null then
    alter table public.featured_event
      drop column if exists timezone,
      drop column if exists ends_at,
      drop column if exists starts_at;
  end if;
end;
$$;
