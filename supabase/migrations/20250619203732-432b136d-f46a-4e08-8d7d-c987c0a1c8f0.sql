
-- Add global_analysis column to ideas table to store global market analysis
ALTER TABLE public.ideas 
ADD COLUMN global_analysis jsonb;

-- Add comment to document the structure of global_analysis
COMMENT ON COLUMN public.ideas.global_analysis IS 'Stores global market analysis data including market acceptance, cultural fit, competition, and entry strategies for different regions';
