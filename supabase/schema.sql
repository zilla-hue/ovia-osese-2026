-- ── Ovia Osese 2026 — Supabase / PostgreSQL Schema ──────────────────────────
-- Run this in the Supabase SQL Editor to set up all tables.
-- Tables use snake_case per PostgreSQL convention.

-- ── Visitors (festival registrations) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
  id                   BIGSERIAL PRIMARY KEY,
  full_name            TEXT        NOT NULL,
  email                TEXT        NOT NULL,
  phone                TEXT        NOT NULL,
  country              TEXT        NOT NULL,
  state                TEXT,
  indigene             TEXT,
  planning_to_attend   TEXT,
  arrival_date         DATE,
  departure_date       DATE,
  group_size           TEXT,
  accommodation        TEXT,
  accommodation_help   TEXT,
  interests            TEXT,        -- comma-separated list of interests
  receive_updates      TEXT,
  status               TEXT        NOT NULL DEFAULT 'pending',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add new columns to existing table (safe to run even if they already exist)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS state               TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS indigene            TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS planning_to_attend  TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS group_size          TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS accommodation       TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS accommodation_help  TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS interests           TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS receive_updates     TEXT;
-- Remove old narrow columns if they exist (ignore errors if already gone)
ALTER TABLE visitors DROP COLUMN IF EXISTS participation_interest;
ALTER TABLE visitors DROP COLUMN IF EXISTS contact_preference;

-- ── Sponsors ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
  id                BIGSERIAL PRIMARY KEY,
  company_name      TEXT        NOT NULL,
  contact_name      TEXT        NOT NULL,
  email             TEXT        NOT NULL,
  phone             TEXT        NOT NULL,
  sponsorship_level TEXT        NOT NULL,
  message           TEXT,
  status            TEXT        NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── News / Announcements ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  content      TEXT        NOT NULL,
  excerpt      TEXT,
  image_url    TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Contact Messages ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  status     TEXT        NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Donations ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                BIGSERIAL PRIMARY KEY,
  donor_name        TEXT           NOT NULL,
  email             TEXT           NOT NULL,
  amount            NUMERIC(12, 2) NOT NULL,
  currency          TEXT           NOT NULL DEFAULT 'NGN',
  donation_type     TEXT           NOT NULL DEFAULT 'one-time',
  payment_status    TEXT           NOT NULL DEFAULT 'pending',
  payment_reference TEXT           UNIQUE,
  message           TEXT,
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── Volunteers ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id               BIGSERIAL PRIMARY KEY,
  full_name        TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  phone            TEXT        NOT NULL,
  country          TEXT        NOT NULL,
  area_of_interest TEXT        NOT NULL,
  availability     TEXT        NOT NULL,
  message          TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Enable RLS on all tables. The server uses the service-role key which bypasses
-- RLS, so these policies protect against direct client access.

ALTER TABLE visitors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE news      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Allow public read on news only
CREATE POLICY "news_public_read" ON news FOR SELECT USING (true);

-- ── Seed News ─────────────────────────────────────────────────────────────────
INSERT INTO news (title, slug, content, excerpt, image_url) VALUES
  (
    'Ovia Osese 2026 Dates Announced',
    'dates-announced',
    'The official dates for Ovia Osese 2026 have been announced. The festival will culminate on April 12, 2026.',
    'The official dates for Ovia Osese 2026 have been announced.',
    'https://picsum.photos/seed/festival/800/400.webp'
  ),
  (
    'Call for Sponsors Open',
    'call-for-sponsors',
    'We are now accepting applications for corporate and individual sponsors for the upcoming festival.',
    'We are now accepting applications for corporate and individual sponsors.',
    'https://picsum.photos/seed/sponsor/800/400.webp'
  )
ON CONFLICT (slug) DO NOTHING;
