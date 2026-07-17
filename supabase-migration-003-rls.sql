-- Migration 003 — Row-Level Security for the guru zone.
--
-- Apply in the Supabase SQL Editor AFTER supabase-migration.sql and
-- supabase-migration-002-fixes.sql (no migration tool is wired up).
--
-- Model: "any authenticated user is a guru". Guru accounts are created by hand
-- in the Supabase dashboard; there is no public signup, so anyone who can log
-- in is staff. The guru web app talks to Postgres through the *authenticated*
-- client (it forwards the guru's JWT), so these policies apply to it.
--
-- The IoT device routes (/api/iot/*) use the SERVICE-ROLE key, which BYPASSES
-- RLS by design — so enabling RLS here does not affect the Orange Pi pipeline.

-- 1. Turn on RLS. With RLS enabled and no policy, access is denied by default,
--    which is why the policies below are required for the guru client to work.
alter table imams           enable row level security;
alter table sholat_sessions enable row level security;
alter table movement_logs   enable row level security;

-- 2. Full access for authenticated gurus; anon (logged-out) requests get nothing.
--    `using (true)` allows reads/updates/deletes on all rows; `with check (true)`
--    allows inserts/updates. Tighten later if per-guru ownership is introduced.
drop policy if exists "guru_all_imams" on imams;
create policy "guru_all_imams" on imams
  for all to authenticated using (true) with check (true);

drop policy if exists "guru_all_sholat_sessions" on sholat_sessions;
create policy "guru_all_sholat_sessions" on sholat_sessions
  for all to authenticated using (true) with check (true);

drop policy if exists "guru_all_movement_logs" on movement_logs;
create policy "guru_all_movement_logs" on movement_logs
  for all to authenticated using (true) with check (true);
