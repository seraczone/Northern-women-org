-- Permanently remove the retired Join Us registration feature and its records.
-- Historical migrations are intentionally retained for migration-history integrity.
drop table if exists public.join_us_registrations cascade;
