
-- Add seed column to ideas table to distinguish demo data from real user data
ALTER TABLE public.ideas 
ADD COLUMN seed BOOLEAN DEFAULT FALSE;

-- Create an index for better query performance
CREATE INDEX idx_ideas_seed ON public.ideas(seed);
