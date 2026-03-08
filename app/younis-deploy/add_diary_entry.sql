insert into diaries (title, content, is_public, created_at, user_id)
select 
  'A Tough Day at School',
  'Ugh. Today was so annoying at school.

My friends were bothering me all day. They wouldn''t stop. Then, they took my stuff—my favorite sparkly pen from my desk. I kept saying "Give it back!" but they just laughed and passed it around.

I felt so angry. My face got all hot. I also felt frustrated because I couldn''t make them stop. It''s not fair!

But then, Miss R saw what was happening. She came over and helped. She made them give my pen back and told them it wasn''t nice to take things without asking.

I was glad she helped them (and me), but I''m still kind of mad at my friends. Maybe tomorrow will be better.

I hope they don''t do it again.',
  true,
  '2025-12-10 12:00:00+00',
  id
from auth.users
limit 1;
