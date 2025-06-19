
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
      seedError: '데모 아이디어 생성 중 오류가 발생했습니다.',
      seedLimitReached: '최대 데모 아이디어 개수에 도달했습니다.',
      generating: '데모 아이디어를 생성하는 중...'
    },
    en: {
      seedGenerated: 'Demo ideas generated successfully!',
      seedError: 'Error occurred while generating demo ideas.',
      seedLimitReached: 'Maximum demo ideas limit reached.',
      generating: 'Generating demo ideas...'
    }
  };

  const generateSeedIdeas = async () => {
    try {
      console.log('Starting seed ideas generation...');
      
      // Show generating toast
      toast({
        title: text[currentLanguage].generating,
        duration: 2000,
      });
      
      const { data, error } = await supabase.functions.invoke('generate-seed-ideas', {
        body: { language: currentLanguage }
      });

      console.log('Seed generation response:', { data, error });

      if (error) {
        console.error('Seed generation error:', error);
        throw error;
      }

      // Check if limit was reached
      if (data?.message?.includes('Maximum') || data?.message?.includes('limit')) {
        toast({
          title: text[currentLanguage].seedLimitReached,
          description: data.message,
          duration: 4000,
        });
      } else {
        toast({
          title: text[currentLanguage].seedGenerated,
          description: `${data?.count || 0}개의 아이디어가 추가되었습니다.`,
          duration: 3000,
        });
      }

      // Always refresh ideas after attempting generation
      console.log('Refreshing ideas list...');
      await fetchIdeas();
      
    } catch (error) {
      console.error('Error generating seed ideas:', error);
      toast({
        title: text[currentLanguage].seedError,
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return {
    generateSeedIdeas
  };
};
