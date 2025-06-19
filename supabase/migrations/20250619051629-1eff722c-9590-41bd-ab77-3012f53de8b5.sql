
-- Add foreign key relationship between ideas.user_id and profiles.id
ALTER TABLE public.ideas 
ADD CONSTRAINT fk_ideas_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
