create extension if not exists pgcrypto;

create table if not exists public.summit_2026_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  address text not null,
  state text not null,
  country text not null,
  occupation text not null,
  organization text,
  expectations text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists summit_2026_registrations_created_at_idx
  on public.summit_2026_registrations (created_at desc);
