create extension if not exists pgcrypto;

create table if not exists public.northern_women_feedback (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text,
  instagram_handle text,
  contact_number text,
  join_reason text not null,
  experience text not null,
  expectations text,
  requested_support text,
  improvement_areas text,
  suggestions text,
  final_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint northern_women_feedback_full_name_check check (char_length(trim(full_name)) >= 3),
  constraint northern_women_feedback_join_reason_check check (char_length(trim(join_reason)) > 0),
  constraint northern_women_feedback_experience_check check (char_length(trim(experience)) > 0)
);

create index if not exists northern_women_feedback_created_at_idx
  on public.northern_women_feedback (created_at desc);

create index if not exists northern_women_feedback_full_name_idx
  on public.northern_women_feedback (full_name);

drop trigger if exists northern_women_feedback_set_updated_at
  on public.northern_women_feedback;

create trigger northern_women_feedback_set_updated_at
before update on public.northern_women_feedback
for each row
execute function public.set_updated_at();

alter table public.northern_women_feedback enable row level security;

drop policy if exists "northern_women_feedback_public_insert" on public.northern_women_feedback;
create policy "northern_women_feedback_public_insert"
on public.northern_women_feedback
for insert
to public
with check (true);

drop policy if exists "northern_women_feedback_admin_select" on public.northern_women_feedback;
create policy "northern_women_feedback_admin_select"
on public.northern_women_feedback
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "northern_women_feedback_admin_delete" on public.northern_women_feedback;
create policy "northern_women_feedback_admin_delete"
on public.northern_women_feedback
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);
