do $$
begin
  begin
    create extension if not exists pg_net;
  exception
    when others then
      raise notice 'Unable to enable pg_net: %', sqlerrm;
  end;

  begin
    create extension if not exists pg_cron;
  exception
    when others then
      raise notice 'Unable to enable pg_cron: %', sqlerrm;
  end;

  begin
    create extension if not exists vault;
  exception
    when others then
      raise notice 'Unable to enable vault: %', sqlerrm;
  end;
end;
$$;
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
  if to_regclass('vault.decrypted_secrets') is null then
    raise notice 'vault.decrypted_secrets is unavailable; skipping send-event-reminders job invocation.';
    return;
  end if;

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

  if project_url is null or btrim(project_url) = '' then
    raise notice 'Vault secret supabase_project_url is missing; skipping send-event-reminders job invocation.';
    return;
  end if;

  if cron_secret is null or btrim(cron_secret) = '' then
    raise notice 'Vault secret event_reminder_cron_secret is missing; skipping send-event-reminders job invocation.';
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
