
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SeedIdeasProps {
  currentLanguage: 'ko' | 'en';
  fetchIdeas: () => void;
}

export const useSeedIdeas = ({ currentLanguage, fetchIdeas }: SeedIdeasProps) => {
  const text = {
    ko: {
      seedGenerated: '데모 아이디어가 생성되었습니다!',
      seedError: '데모 아이디어 생성 중 오류가 발생했습니다.'
    },
    en: {
      seedGenerated: 'Demo ideas generated successfully!',
      seedError: 'Error occurred while generating demo ideas.'
    }
  };

  const generateSeedIdeas = async () => {
    try {
      console.log('Generating seed ideas...');
      
      const { data, error } = await supabase.functions.invoke('generate-seed-ideas', {
        body: { language: currentLanguage }
      });

      if (error) throw error;

      toast({
        title: text[currentLanguage].seedGenerated,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating seed ideas:', error);
      toast({
        title: text[currentLanguage].seedError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return {
    generateSeedIdeas
  };
};
