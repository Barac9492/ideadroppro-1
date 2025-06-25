
-- Add vector embedding support and clustering tables
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to idea_modules table
ALTER TABLE idea_modules 
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS cluster_id integer,
ADD COLUMN IF NOT EXISTS cluster_label text;

-- Create module clusters table
CREATE TABLE IF NOT EXISTS module_clusters (
  id SERIAL PRIMARY KEY,
  cluster_id integer NOT NULL,
  cluster_label text,
  center_embedding vector(1536),
  member_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create module similarities table for quick lookups
CREATE TABLE IF NOT EXISTS module_similarities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  module_a_id uuid REFERENCES idea_modules(id) ON DELETE CASCADE,
  module_b_id uuid REFERENCES idea_modules(id) ON DELETE CASCADE,
  similarity_score numeric(5,4) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(module_a_id, module_b_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_modules_embedding ON idea_modules USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_modules_cluster ON idea_modules(cluster_id);
CREATE INDEX IF NOT EXISTS idx_similarities_score ON module_similarities(similarity_score DESC);

-- Function to calculate cosine similarity between embeddings
CREATE OR REPLACE FUNCTION cosine_similarity(embedding1 vector, embedding2 vector)
RETURNS numeric AS $$
BEGIN
  RETURN 1 - (embedding1 <=> embedding2);
END;
$$ LANGUAGE plpgsql;

-- Function to find similar modules
CREATE OR REPLACE FUNCTION find_similar_modules(target_module_id uuid, similarity_threshold numeric DEFAULT 0.8, limit_count integer DEFAULT 10)
RETURNS TABLE (
  module_id uuid,
  similarity_score numeric,
  module_type text,
  content text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    cosine_similarity(
      (SELECT embedding FROM idea_modules WHERE id = target_module_id),
      m.embedding
    ) as similarity,
    m.module_type::text,
    m.content
  FROM idea_modules m
  WHERE m.id != target_module_id 
    AND m.embedding IS NOT NULL
    AND cosine_similarity(
      (SELECT embedding FROM idea_modules WHERE id = target_module_id),
      m.embedding
    ) >= similarity_threshold
  ORDER BY similarity DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
