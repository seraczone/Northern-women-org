create extension if not exists pgcrypto;
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'footer',
  status text not null default 'subscribed',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);
drop trigger if exists newsletter_subscribers_set_updated_at
  on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_updated_at();
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "newsletter_admin_select" on public.newsletter_subscribers;
create policy "newsletter_admin_select"
on public.newsletter_subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);
drop policy if exists "newsletter_admin_delete" on public.newsletter_subscribers;
create policy "newsletter_admin_delete"
on public.newsletter_subscribers
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);
