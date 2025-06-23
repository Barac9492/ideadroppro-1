
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface IdeaDeletionProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => Promise<void>;
}

export const useIdeaDeletion = ({ currentLanguage, user, fetchIdeas }: IdeaDeletionProps) => {
  const text = {
    ko: {
      confirmDelete: '정말로 이 아이디어를 삭제하시겠습니까?',
      deleteSuccess: '아이디어가 삭제되었습니다',
      deleteError: '아이디어 삭제 중 오류가 발생했습니다',
      unauthorized: '삭제 권한이 없습니다'
    },
    en: {
      confirmDelete: 'Are you sure you want to delete this idea?',
      deleteSuccess: 'Idea deleted successfully',
      deleteError: 'Error deleting idea',
      unauthorized: 'Unauthorized to delete this idea'
    }
  };

  const deleteIdea = async (ideaId: string): Promise<void> => {
    if (!user) {
      toast({
        title: text[currentLanguage].unauthorized,
        variant: 'destructive',
        duration: 3000,
      });
      return Promise.resolve();
    }

    if (!confirm(text[currentLanguage].confirmDelete)) {
      return Promise.resolve();
    }

    try {
      const { data, error } = await supabase.rpc('delete_idea_cascade', {
        idea_id: ideaId,
        user_id: user.id
      });

      if (error) throw error;

      if (!data) {
        toast({
          title: text[currentLanguage].unauthorized,
          variant: 'destructive',
          duration: 3000,
        });
        return Promise.resolve();
      }

      toast({
        title: text[currentLanguage].deleteSuccess,
        duration: 3000,
      });

      await fetchIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: text[currentLanguage].deleteError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return { deleteIdea };
};
