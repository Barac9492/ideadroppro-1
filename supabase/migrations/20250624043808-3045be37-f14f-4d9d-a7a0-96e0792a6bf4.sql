
-- Create user module library table
CREATE TABLE public.user_module_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_data JSONB NOT NULL,
  module_type TEXT NOT NULL,
  original_idea_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_module_library ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own modules" 
  ON public.user_module_library 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own modules" 
  ON public.user_module_library 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own modules" 
  ON public.user_module_library 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own modules" 
  ON public.user_module_library 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_user_module_library_user_id ON public.user_module_library(user_id);
CREATE INDEX idx_user_module_library_type ON public.user_module_library(module_type);
