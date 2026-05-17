create table if not exists public.internal_app_secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
revoke all on table public.internal_app_secrets from public;
do $$
begin
  begin
    revoke all on table public.internal_app_secrets from anon;
  exception
    when undefined_object then
      null;
  end;

  begin
    revoke all on table public.internal_app_secrets from authenticated;
  exception
    when undefined_object then
      null;
  end;

  begin
    revoke all on table public.internal_app_secrets from service_role;
  exception
    when undefined_object then
      null;
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
    select value
      into project_url
      from public.internal_app_secrets
      where key = 'supabase_project_url'
      limit 1;
  end if;

  if cron_secret is null or btrim(cron_secret) = '' then
    select value
      into cron_secret
      from public.internal_app_secrets
      where key = 'event_reminder_cron_secret'
      limit 1;
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
