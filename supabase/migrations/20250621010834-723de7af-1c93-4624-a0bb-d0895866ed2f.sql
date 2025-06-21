
-- Add idea deletion cascade and remix tracking improvements
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS remix_parent_id uuid REFERENCES ideas(id) ON DELETE SET NULL;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS remix_count integer DEFAULT 0;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS remix_chain_depth integer DEFAULT 0;

-- Create function to handle idea deletion with cascades
CREATE OR REPLACE FUNCTION delete_idea_cascade(idea_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user owns the idea
  IF NOT EXISTS (
    SELECT 1 FROM ideas 
    WHERE id = idea_id AND user_id = delete_idea_cascade.user_id
  ) THEN
    RETURN false;
  END IF;
  
  -- Delete related records
  DELETE FROM idea_likes WHERE idea_id = delete_idea_cascade.idea_id;
  DELETE FROM influence_score_logs WHERE reference_id = delete_idea_cascade.idea_id;
  
  -- Update remix parent references
  UPDATE ideas SET remix_parent_id = NULL WHERE remix_parent_id = delete_idea_cascade.idea_id;
  
  -- Delete the idea
  DELETE FROM ideas WHERE id = delete_idea_cascade.idea_id;
  
  RETURN true;
END;
$$;

-- Create function to update remix counts
CREATE OR REPLACE FUNCTION update_remix_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.remix_parent_id IS NOT NULL THEN
    -- Increment remix count for parent
    UPDATE ideas 
    SET remix_count = remix_count + 1 
    WHERE id = NEW.remix_parent_id;
    
    -- Set remix chain depth
    NEW.remix_chain_depth = COALESCE(
      (SELECT remix_chain_depth + 1 FROM ideas WHERE id = NEW.remix_parent_id),
      1
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for remix count updates
DROP TRIGGER IF EXISTS trigger_update_remix_count ON ideas;
CREATE TRIGGER trigger_update_remix_count
  BEFORE INSERT ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_remix_count();
