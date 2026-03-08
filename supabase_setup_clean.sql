-- YOUNIS ADVENTURES - SUPABASE SETUP
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/sql

-- 1. FRIENDS NOTES TABLE
create table if not exists friends_notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_name text not null,
  message text not null,
  is_public boolean default true
);

alter table friends_notes enable row level security;

create policy "Enable read access for all users"
on friends_notes for select
using (is_public = true);

create policy "Enable insert access for all users"
on friends_notes for insert
with check (true);

create index if not exists idx_friends_notes_created on friends_notes(created_at desc);


-- 2. AI BEDTIME STORIES TABLE
create table if not exists ai_stories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  child_name text not null,
  child_age integer not null,
  story_concept text not null,
  story_title text not null,
  story_content text not null,
  is_public boolean default true
);

alter table ai_stories enable row level security;

create policy "Enable read access for all public stories"
on ai_stories for select
using (is_public = true);

create policy "Enable insert access for all users"
on ai_stories for insert
with check (true);

create index if not exists idx_ai_stories_public on ai_stories(is_public);
create index if not exists idx_ai_stories_created on ai_stories(created_at desc);


-- 3. PERSONAL DIARIES TABLE
create table if not exists personal_diaries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  content text not null,
  mood text,
  is_public boolean default false,
  user_id uuid references auth.users not null
);

alter table personal_diaries enable row level security;

create policy "Enable read access for own and public diaries"
on personal_diaries for select
using (auth.uid() = user_id OR is_public = true);

create policy "Enable insert access for own diaries"
on personal_diaries for insert
with check (auth.uid() = user_id);

create policy "Enable update access for own diaries"
on personal_diaries for update
using (auth.uid() = user_id);

create policy "Enable delete access for own diaries"
on personal_diaries for delete
using (auth.uid() = user_id);

create index if not exists idx_diaries_user on personal_diaries(user_id);
create index if not exists idx_diaries_public on personal_diaries(is_public);
create index if not exists idx_diaries_created on personal_diaries(created_at desc);


-- 4. ADVENTURE LOCATIONS TABLE
create table if not exists adventure_locations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  latitude numeric not null,
  longitude numeric not null,
  image_url text,
  is_public boolean default true
);

alter table adventure_locations enable row level security;

create policy "Enable read access for all public locations"
on adventure_locations for select
using (is_public = true);

create policy "Enable insert access for authenticated users"
on adventure_locations for insert
with check (auth.role() = 'authenticated');

create index if not exists idx_locations_public on adventure_locations(is_public);


-- 5. VIDEO REMINDERS TABLE
create table if not exists video_reminders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  video_id text,
  sent boolean default false,
  sent_at timestamp with time zone
);

alter table video_reminders enable row level security;

create policy "Enable insert access for all users"
on video_reminders for insert
with check (true);

create policy "Enable read access for authenticated users"
on video_reminders for select
using (auth.role() = 'authenticated');

create index if not exists idx_reminders_sent on video_reminders(sent);
