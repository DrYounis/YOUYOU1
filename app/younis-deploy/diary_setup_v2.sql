-- Create the new, better Diaries table
create table diaries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  content text not null,
  is_public boolean default false,
  user_id uuid references auth.users not null
);

-- Enable Security
alter table diaries enable row level security;

-- Policy 1: Everyone can read PUBLIC diaries
create policy "Public diaries are viewable by everyone"
on diaries for select
using (is_public = true);

-- Policy 2: User can see ALL their own diaries (Private & Public)
create policy "Users can read own diaries"
on diaries for select
using (auth.uid() = user_id);

-- Policy 3: User can insert their own diaries
create policy "Users can insert own diaries"
on diaries for insert
with check (auth.uid() = user_id);

-- Policy 4: User can update/delete their own diaries
create policy "Users can update own diaries"
on diaries for update
using (auth.uid() = user_id);

create policy "Users can delete own diaries"
on diaries for delete
using (auth.uid() = user_id);
