
import { supabase } from '@/integrations/supabase/client';

interface IdeaLikesProps {
  user: any;
  ideas: any[];
  fetchIdeas: () => void;
}

export const useIdeaLikes = ({ user, ideas, fetchIdeas }: IdeaLikesProps) => {
  const toggleLike = async (ideaId: string) => {
    if (!user) return;

    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (!idea || idea.seed) return; // Prevent liking seed ideas

      if (idea.hasLiked) {
        await supabase
          .from('idea_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', ideaId);
      } else {
        await supabase
          .from('idea_likes')
          .insert([{
            user_id: user.id,
            idea_id: ideaId
          }]);
      }

      fetchIdeas();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return {
    toggleLike
  };
};
