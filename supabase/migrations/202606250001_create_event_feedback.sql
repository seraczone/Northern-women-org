create extension if not exists pgcrypto;

create table if not exists public.event_feedback (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text,
  social_handle text,
  contact_number text,
  joined_reason text not null,
  experience text not null,
  expectations text,
  requested_support text,
  improvement_areas text,
  suggestions text,
  final_message text,
  consent boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint event_feedback_full_name_check check (char_length(btrim(full_name)) >= 3),
  constraint event_feedback_joined_reason_check check (char_length(btrim(joined_reason)) > 0),
  constraint event_feedback_experience_check check (char_length(btrim(experience)) > 0),
  constraint event_feedback_consent_check check (consent = true)
);

create index if not exists event_feedback_created_at_idx
  on public.event_feedback (created_at desc);

create index if not exists event_feedback_full_name_idx
  on public.event_feedback (full_name);

drop trigger if exists event_feedback_set_updated_at
  on public.event_feedback;

create trigger event_feedback_set_updated_at
before update on public.event_feedback
for each row
execute function public.set_updated_at();

alter table public.event_feedback enable row level security;

drop policy if exists "event_feedback_public_insert" on public.event_feedback;
create policy "event_feedback_public_insert"
on public.event_feedback
for insert
to public
with check (true);

drop policy if exists "event_feedback_admin_select" on public.event_feedback;
create policy "event_feedback_admin_select"
on public.event_feedback
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "event_feedback_admin_delete" on public.event_feedback;
create policy "event_feedback_admin_delete"
on public.event_feedback
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);
