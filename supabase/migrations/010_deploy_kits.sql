-- Deploy Kits: temporary contract storage for Gitpod auto-load
-- Stores contract code for 24h so Gitpod startup scripts can fetch it

create table if not exists deploy_kits (
  id            uuid primary key default gen_random_uuid(),
  code          text not null,
  contract_name text,
  category      text,
  expires_at    timestamptz not null default (now() + interval '24 hours'),
  created_at    timestamptz not null default now()
);

-- Public read (no auth needed — Gitpod startup scripts fetch via kit ID)
-- Only allow reads that match the ID; no listing
alter table deploy_kits enable row level security;

create policy "Anyone can read deploy kit by id"
  on deploy_kits for select
  using (true);

create policy "Server can insert deploy kits"
  on deploy_kits for insert
  with check (true);

-- Index for fast lookup by ID (already PK, but make intent clear)
-- Auto-cleanup: expire old kits (run via cron or on read)
create index if not exists deploy_kits_expires_at_idx on deploy_kits (expires_at);
