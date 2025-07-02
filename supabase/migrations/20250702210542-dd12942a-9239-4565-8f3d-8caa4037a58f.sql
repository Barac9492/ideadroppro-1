-- 보안 취약점 수정: public 권한을 authenticated로 변경

-- 1. combination_feedback 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create their own feedback" ON public.combination_feedback;
DROP POLICY IF EXISTS "Users can delete their own feedback" ON public.combination_feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON public.combination_feedback;

CREATE POLICY "Users can create their own feedback" 
ON public.combination_feedback 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback" 
ON public.combination_feedback 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" 
ON public.combination_feedback 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- 2. combination_recommendations 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create their own recommendations" ON public.combination_recommendations;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.combination_recommendations;

CREATE POLICY "Users can create their own recommendations" 
ON public.combination_recommendations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendations" 
ON public.combination_recommendations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 3. genetic_generations 테이블 정책 수정
DROP POLICY IF EXISTS "Only system can create genetic generations" ON public.genetic_generations;

CREATE POLICY "Only system can create genetic generations" 
ON public.genetic_generations 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 4. idea_compositions 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create compositions for their ideas" ON public.idea_compositions;
DROP POLICY IF EXISTS "Users can delete compositions for their ideas" ON public.idea_compositions;
DROP POLICY IF EXISTS "Users can update compositions for their ideas" ON public.idea_compositions;
DROP POLICY IF EXISTS "Users can view all compositions" ON public.idea_compositions;

CREATE POLICY "Users can create compositions for their ideas" 
ON public.idea_compositions 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS ( SELECT 1 FROM ideas WHERE ideas.id = idea_compositions.idea_id AND ideas.user_id = auth.uid()));

CREATE POLICY "Users can delete compositions for their ideas" 
ON public.idea_compositions 
FOR DELETE 
TO authenticated
USING (EXISTS ( SELECT 1 FROM ideas WHERE ideas.id = idea_compositions.idea_id AND ideas.user_id = auth.uid()));

CREATE POLICY "Users can update compositions for their ideas" 
ON public.idea_compositions 
FOR UPDATE 
TO authenticated
USING (EXISTS ( SELECT 1 FROM ideas WHERE ideas.id = idea_compositions.idea_id AND ideas.user_id = auth.uid()));

CREATE POLICY "Users can view all compositions" 
ON public.idea_compositions 
FOR SELECT 
TO authenticated
USING (true);

-- 5. idea_likes 테이블 정책 수정
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.idea_likes;

CREATE POLICY "Users can manage their own likes" 
ON public.idea_likes 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id);

-- 6. idea_modules 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create their own modules" ON public.idea_modules;
DROP POLICY IF EXISTS "Users can delete their own modules" ON public.idea_modules;
DROP POLICY IF EXISTS "Users can update their own modules" ON public.idea_modules;
DROP POLICY IF EXISTS "Users can view all modules" ON public.idea_modules;

CREATE POLICY "Users can create their own modules" 
ON public.idea_modules 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own modules" 
ON public.idea_modules 
FOR DELETE 
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can update their own modules" 
ON public.idea_modules 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can view all modules" 
ON public.idea_modules 
FOR SELECT 
TO authenticated
USING (true);

-- 7. ideas 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can delete their own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can update their own ideas" ON public.ideas;

CREATE POLICY "Users can create ideas" 
ON public.ideas 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" 
ON public.ideas 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" 
ON public.ideas 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- 8. influence_score_logs 테이블 정책 수정
DROP POLICY IF EXISTS "Users can view their own score logs" ON public.influence_score_logs;

CREATE POLICY "Users can view their own score logs" 
ON public.influence_score_logs 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 9. module_combinations 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create their own combinations" ON public.module_combinations;
DROP POLICY IF EXISTS "Users can delete their own combinations" ON public.module_combinations;
DROP POLICY IF EXISTS "Users can update their own combinations" ON public.module_combinations;
DROP POLICY IF EXISTS "Users can view their own combinations" ON public.module_combinations;

CREATE POLICY "Users can create their own combinations" 
ON public.module_combinations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own combinations" 
ON public.module_combinations 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own combinations" 
ON public.module_combinations 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own combinations" 
ON public.module_combinations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 10. module_recommendations 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create recommendations" ON public.module_recommendations;
DROP POLICY IF EXISTS "Users can view all recommendations" ON public.module_recommendations;

CREATE POLICY "Users can create recommendations" 
ON public.module_recommendations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view all recommendations" 
ON public.module_recommendations 
FOR SELECT 
TO authenticated
USING (true);

-- 11. profiles 테이블 정책 수정
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- 12. user_badges 테이블 정책 수정
DROP POLICY IF EXISTS "System can insert badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;

CREATE POLICY "System can insert badges" 
ON public.user_badges 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 13. user_influence_scores 테이블 정책 수정
DROP POLICY IF EXISTS "Users can update their own influence scores" ON public.user_influence_scores;
DROP POLICY IF EXISTS "Users can view their own influence scores" ON public.user_influence_scores;

CREATE POLICY "Users can update their own influence scores" 
ON public.user_influence_scores 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own influence scores" 
ON public.user_influence_scores 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 14. user_invitations 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can update their invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view invitations sent to them" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view their sent invitations" ON public.user_invitations;

CREATE POLICY "Users can create invitations" 
ON public.user_invitations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their invitations" 
ON public.user_invitations 
FOR UPDATE 
TO authenticated
USING ((auth.uid() = inviter_id) OR (auth.uid() = invitee_id));

CREATE POLICY "Users can view invitations sent to them" 
ON public.user_invitations 
FOR SELECT 
TO authenticated
USING (auth.uid() = invitee_id);

CREATE POLICY "Users can view their sent invitations" 
ON public.user_invitations 
FOR SELECT 
TO authenticated
USING (auth.uid() = inviter_id);

-- 15. user_module_library 테이블 정책 수정
DROP POLICY IF EXISTS "Users can create their own modules" ON public.user_module_library;
DROP POLICY IF EXISTS "Users can delete their own modules" ON public.user_module_library;
DROP POLICY IF EXISTS "Users can update their own modules" ON public.user_module_library;
DROP POLICY IF EXISTS "Users can view their own modules" ON public.user_module_library;

CREATE POLICY "Users can create their own modules" 
ON public.user_module_library 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own modules" 
ON public.user_module_library 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own modules" 
ON public.user_module_library 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own modules" 
ON public.user_module_library 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 16. user_roles 테이블 정책 수정
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 17. user_streaks 테이블 정책 수정
DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.user_streaks;

CREATE POLICY "Users can insert their own streaks" 
ON public.user_streaks 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.user_streaks 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own streaks" 
ON public.user_streaks 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);