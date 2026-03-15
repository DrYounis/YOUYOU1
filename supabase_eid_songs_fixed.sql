-- ============================================
-- EID SONGS - SAVE FEATURE (FIXED)
-- ============================================
-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Drop existing table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS eid_songs CASCADE;

-- ============================================
-- EID SONGS TABLE (Save songs with user info)
-- ============================================
create table eid_songs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  parent_name text not null,
  parent_email text not null,
  parent_phone text,
  child_name text not null,
  song_title text not null,
  song_lyrics text not null,
  language text default 'ar',
  audio_url text,
  is_public boolean default false
);

-- Enable Row Level Security (RLS)
alter table eid_songs enable row level security;

-- Policy: Everyone can read (for simplicity)
create policy "Enable read access for all users"
on eid_songs for select using (true);

-- Policy: Everyone can insert songs
create policy "Enable insert access for all users"
on eid_songs for insert with check (true);

-- Create index for faster queries
create index if not exists idx_eid_songs_email on eid_songs(parent_email);
create index if not exists idx_eid_songs_created on eid_songs(created_at desc);

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
