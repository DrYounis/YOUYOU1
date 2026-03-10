-- ============================================
-- SUPABASE SETUP FOR YOUYOU-1
-- ============================================
-- Run this ONCE in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ============================================
-- 1. FRIENDS NOTES TABLE (if not exists)
-- ============================================
create table if not exists friends_notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_name text not null,
  message text not null,
  is_public boolean default true
);

-- Enable Row Level Security (RLS)
alter table friends_notes enable row level security;

-- Policies (only create if they don't exist)
DO $$ BEGIN
    -- Policy: Everyone can read notes
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'friends_notes' AND policyname = 'Enable read access for all users'
    ) THEN
        create policy "Enable read access for all users"
        on friends_notes for select
        using (is_public = true);
    END IF;

    -- Policy: Everyone can insert notes
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'friends_notes' AND policyname = 'Enable insert access for all users'
    ) THEN
        create policy "Enable insert access for all users"
        on friends_notes for insert
        with check (true);
    END IF;
END $$;

-- Create index for faster queries
create index if not exists idx_friends_notes_created on friends_notes(created_at desc);


-- ============================================
-- 2. AI BEDTIME STORIES TABLE
-- ============================================
create table if not exists ai_stories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  child_name text not null,
  child_age integer not null,
  story_concept text not null,
  story_title text not null,
  story_content text not null,
  language text default 'en',
  is_public boolean default true
);

-- Enable Row Level Security (RLS)
alter table ai_stories enable row level security;

-- Policies for stories
DO $$ BEGIN
    -- Policy: Everyone can read public stories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'ai_stories' AND policyname = 'Enable read access for all public stories'
    ) THEN
        create policy "Enable read access for all public stories"
        on ai_stories for select
        using (is_public = true);
    END IF;

    -- Policy: Everyone can insert stories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'ai_stories' AND policyname = 'Enable insert access for all users'
    ) THEN
        create policy "Enable insert access for all users"
        on ai_stories for insert
        with check (true);
    END IF;
END $$;

-- Create indexes
create index if not exists idx_ai_stories_public on ai_stories(is_public);
create index if not exists idx_ai_stories_created on ai_stories(created_at desc);
create index if not exists idx_ai_stories_language on ai_stories(language);


-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Your database is ready to use!
-- - friends_notes (for Friends page messages)
-- - ai_stories (for bedtime stories with language support)
