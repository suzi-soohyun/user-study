-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
create table results (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  participant text,
  trial text,
  choice text,
  time_ms int
);

-- Visitors may only insert answers, not read or change them.
alter table results enable row level security;
create policy "insert only" on results for insert to anon with check (true);
grant insert on results to anon;
