create extension if not exists pgcrypto;

create table if not exists public.join_us_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  state text not null,
  country text not null,
  interest_area text not null,
  message text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists join_us_registrations_created_at_idx
  on public.join_us_registrations (created_at desc);
