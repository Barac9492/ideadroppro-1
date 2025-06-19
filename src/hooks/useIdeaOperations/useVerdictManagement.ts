
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ideaOperationsText } from './constants';

interface UseVerdictManagementProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useVerdictManagement = ({ currentLanguage, user, fetchIdeas }: UseVerdictManagementProps) => {
  const text = ideaOperationsText[currentLanguage];

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ideas')
        .update({ final_verdict: verdict })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text.verdictSaved,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error saving verdict:', error);
      toast({
        title: text.verdictError,  
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return { saveFinalVerdict };
};
