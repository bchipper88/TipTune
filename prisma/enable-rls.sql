-- Enable Row-Level Security on all public tables.
--
-- All application data access goes through Prisma, which connects as the
-- `postgres` role (BYPASSRLS) via DATABASE_URL / DIRECT_URL. Enabling RLS
-- here does not affect Prisma; it blocks the `anon` and `authenticated`
-- roles that Supabase exposes via PostgREST with the public anon key.
--
-- With RLS enabled and no policies, the REST API returns zero rows and
-- rejects writes for anon/authenticated clients — which is what we want,
-- since the frontend only uses Supabase for Auth and Storage, never for
-- table queries.
--
-- Run this once against the Supabase database (e.g. in the SQL Editor)
-- after `prisma db push` has created the tables.

ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows          ENABLE ROW LEVEL SECURITY;
