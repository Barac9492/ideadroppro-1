
-- Allow admins to delete any idea
CREATE POLICY "Admins can delete any idea" ON public.ideas
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) OR user_id = auth.uid()
);

-- Allow admins to view all ideas (if not already exists)
CREATE POLICY "Admins can view all ideas" ON public.ideas
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) OR user_id = auth.uid()
);

-- Allow admins to delete any idea likes
CREATE POLICY "Admins can delete any idea likes" ON public.idea_likes
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) OR user_id = auth.uid()
);

-- Clean up test data with meaningless content
DELETE FROM public.ideas 
WHERE text LIKE '%test%' 
   OR text LIKE '%테스트%' 
   OR text LIKE '%newuser%'
   OR LENGTH(TRIM(text)) < 10
   OR user_id IN (
     SELECT p.id FROM public.profiles p 
     WHERE p.username LIKE 'user_%' 
       AND p.username ~ '^user_[0-9]+$'
   );

-- Clean up orphaned likes
DELETE FROM public.idea_likes 
WHERE idea_id NOT IN (SELECT id FROM public.ideas);

-- Update existing profiles with generic usernames to have more meaningful names
UPDATE public.profiles 
SET username = 'anonymous_' || SUBSTRING(id::text, 1, 8)
WHERE username LIKE 'user_%' AND username ~ '^user_[0-9]+$';
