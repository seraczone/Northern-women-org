create or replace function public.invoke_send_event_reminders_job()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  project_url text;
  cron_secret text;
begin
  if to_regclass('vault.decrypted_secrets') is not null then
    select decrypted_secret
      into project_url
      from vault.decrypted_secrets
      where name = 'supabase_project_url'
      limit 1;

    select decrypted_secret
      into cron_secret
      from vault.decrypted_secrets
      where name = 'event_reminder_cron_secret'
      limit 1;
  end if;

  if project_url is null or btrim(project_url) = '' then
    project_url := current_setting('app.settings.supabase_project_url', true);
  end if;

  if cron_secret is null or btrim(cron_secret) = '' then
    cron_secret := current_setting('app.settings.event_reminder_cron_secret', true);
  end if;

  if project_url is null or btrim(project_url) = '' then
    raise notice 'No event reminder project URL configured; skipping send-event-reminders job invocation.';
    return;
  end if;

  if cron_secret is null or btrim(cron_secret) = '' then
    raise notice 'No event reminder cron secret configured; skipping send-event-reminders job invocation.';
    return;
  end if;

  perform net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/send-event-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cron_secret
    ),
    body := '{}'::jsonb
  );
end;
$$;
do $$
declare
  existing_job_id bigint;
begin
  if to_regclass('cron.job') is null then
    raise notice 'cron.job is unavailable; skipping pg_cron schedule for send-event-reminders.';
    return;
  end if;

  for existing_job_id in
    select jobid
    from cron.job
    where jobname = 'send-event-reminders-hourly'
  loop
    perform cron.unschedule(existing_job_id);
  end loop;

  perform cron.schedule(
    'send-event-reminders-hourly',
    '5 * * * *',
    $job$select public.invoke_send_event_reminders_job();$job$
  );
end;
$$;
