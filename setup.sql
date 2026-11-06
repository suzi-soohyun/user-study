-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
create table results (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  username text,
  trial text,
  choice text,   -- disc_low or disc_high
  sample text,   -- id of the chosen motion, e.g. 5261_23
  left_label text, -- label shown on the left
  time_ms int
);

-- Visitors may only insert answers, not read or change them.
alter table results enable row level security;
create policy "insert only" on results for insert to anon with check (true);
grant insert on results to anon;

-- If the table already exists, run this instead of create table:
-- alter table results add column sample text, add column left_label text;
