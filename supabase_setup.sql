-- Create table for Public Friends Notes
create table friends_notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_name text not null,
  message text not null
);

-- Enable Row Level Security (RLS)
alter table friends_notes enable row level security;

-- Policy: Everyone can read notes
create policy "Enable read access for all users"
on friends_notes for select
using (true);

-- Policy: Everyone can insert notes
create policy "Enable insert access for all users"
on friends_notes for insert
with check (true);

-- Create table for Personal Private Diaries
create table personal_diaries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table personal_diaries enable row level security;

-- Policy: Users can only see their own diaries
create policy "Enable read access for own diaries"
on personal_diaries for select
using (auth.uid() = user_id);

-- Policy: Users can only insert their own diaries
create policy "Enable insert access for own diaries"
on personal_diaries for insert
with check (auth.uid() = user_id);
