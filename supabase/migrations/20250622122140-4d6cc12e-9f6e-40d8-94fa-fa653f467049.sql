
-- Create enum for module types
CREATE TYPE module_type AS ENUM (
  'problem',
  'solution', 
  'target_customer',
  'value_proposition',
  'revenue_model',
  'key_activities',
  'key_resources',
  'channels',
  'competitive_advantage',
  'market_size',
  'team',
  'potential_risks'
);

-- Create table for storing individual idea modules
CREATE TABLE public.idea_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_type module_type NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  original_idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1,
  quality_score NUMERIC DEFAULT 0,
  usage_count INTEGER DEFAULT 0
);

-- Create table for idea compositions (which modules make up each idea)
CREATE TABLE public.idea_compositions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.idea_modules(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, module_id)
);

-- Create table for module compatibility and recommendations
CREATE TABLE public.module_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_module_id UUID REFERENCES public.idea_modules(id) ON DELETE CASCADE NOT NULL,
  recommended_module_id UUID REFERENCES public.idea_modules(id) ON DELETE CASCADE NOT NULL,
  compatibility_score NUMERIC DEFAULT 0,
  recommendation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_module_id, recommended_module_id)
);

-- Create table for module templates and metadata
CREATE TABLE public.module_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_type module_type NOT NULL,
  template_name TEXT NOT NULL,
  description TEXT,
  example_content TEXT,
  validation_rules JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add module-related columns to existing ideas table
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_modular BOOLEAN DEFAULT false;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS composition_version INTEGER DEFAULT 1;

-- Enable RLS on new tables
ALTER TABLE public.idea_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for idea_modules
CREATE POLICY "Users can view all modules" ON public.idea_modules FOR SELECT USING (true);
CREATE POLICY "Users can create their own modules" ON public.idea_modules FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own modules" ON public.idea_modules FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own modules" ON public.idea_modules FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for idea_compositions  
CREATE POLICY "Users can view all compositions" ON public.idea_compositions FOR SELECT USING (true);
CREATE POLICY "Users can create compositions for their ideas" ON public.idea_compositions FOR INSERT WITH CHECK (
  EXISTS(SELECT 1 FROM public.ideas WHERE id = idea_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update compositions for their ideas" ON public.idea_compositions FOR UPDATE USING (
  EXISTS(SELECT 1 FROM public.ideas WHERE id = idea_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete compositions for their ideas" ON public.idea_compositions FOR DELETE USING (
  EXISTS(SELECT 1 FROM public.ideas WHERE id = idea_id AND user_id = auth.uid())
);

-- RLS policies for module_recommendations
CREATE POLICY "Users can view all recommendations" ON public.module_recommendations FOR SELECT USING (true);
CREATE POLICY "Users can create recommendations" ON public.module_recommendations FOR INSERT WITH CHECK (true);

-- RLS policies for module_templates
CREATE POLICY "Users can view all templates" ON public.module_templates FOR SELECT USING (true);

-- Function to automatically increment usage count when module is used
CREATE OR REPLACE FUNCTION increment_module_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.idea_modules 
  SET usage_count = usage_count + 1 
  WHERE id = NEW.module_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment usage count
CREATE TRIGGER increment_module_usage_trigger
  AFTER INSERT ON public.idea_compositions
  FOR EACH ROW
  EXECUTE FUNCTION increment_module_usage();

-- Function to update module quality score based on idea performance
CREATE OR REPLACE FUNCTION update_module_quality_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Update quality scores of all modules in the idea based on idea score
  UPDATE public.idea_modules 
  SET quality_score = (
    SELECT AVG(i.score) 
    FROM public.ideas i
    JOIN public.idea_compositions ic ON i.id = ic.idea_id
    WHERE ic.module_id = idea_modules.id
  )
  WHERE id IN (
    SELECT ic.module_id 
    FROM public.idea_compositions ic 
    WHERE ic.idea_id = NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update module quality when idea score changes
CREATE TRIGGER update_module_quality_trigger
  AFTER UPDATE OF score ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_module_quality_scores();

-- Insert initial module templates
INSERT INTO public.module_templates (module_type, template_name, description, example_content) VALUES
('problem', 'Basic Problem Statement', 'A clear description of the problem being solved', 'Users struggle with managing their daily tasks efficiently'),
('solution', 'Product Solution', 'The core product or service offering', 'A mobile app that uses AI to prioritize and organize tasks'),
('target_customer', 'Demographics', 'Target customer segment definition', 'Working professionals aged 25-40 in urban areas'),
('value_proposition', 'Core Value', 'Unique value delivered to customers', 'Save 2+ hours daily through intelligent task management'),
('revenue_model', 'Subscription Model', 'How the business generates revenue', 'Freemium model with premium features at $9.99/month'),
('key_activities', 'Core Operations', 'Essential business activities', 'Software development, customer support, marketing'),
('key_resources', 'Required Assets', 'Critical resources needed', 'AI technology, development team, user data'),
('channels', 'Distribution Strategy', 'How to reach customers', 'App stores, social media marketing, partnerships'),
('competitive_advantage', 'Differentiation', 'What makes this unique', 'Advanced AI algorithms and seamless user experience'),
('market_size', 'Market Opportunity', 'Size of addressable market', '$2B productivity software market growing at 8% annually'),
('team', 'Team Composition', 'Key team members and skills', 'Experienced founders with AI and product management background'),
('potential_risks', 'Risk Assessment', 'Major risks and mitigation', 'Competition from big tech, solved by rapid innovation');
