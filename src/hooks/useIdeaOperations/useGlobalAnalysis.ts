
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ideaOperationsText } from './constants';

interface UseGlobalAnalysisProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useGlobalAnalysis = ({ currentLanguage, user, fetchIdeas }: UseGlobalAnalysisProps) => {
  const text = ideaOperationsText[currentLanguage];

  const generateGlobalAnalysis = async (ideaId: string, ideaText: string) => {
    if (!user) return;

    try {
      console.log('Generating global analysis for idea:', ideaText);
      
      const { data: globalAnalysisData, error: globalAnalysisError } = await supabase.functions.invoke('analyze-global-market', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
        }
      });

      if (globalAnalysisError) {
        console.error('Global analysis error:', globalAnalysisError);
        throw new Error('글로벌 분석 생성 중 오류가 발생했습니다.');
      }

      console.log('Global analysis result:', globalAnalysisData);

      const { error } = await supabase
        .from('ideas')
        .update({ global_analysis: globalAnalysisData })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ko' ? '🌍 글로벌 시장 분석이 완료되었습니다!' : '🌍 Global Market Analysis Completed!',
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating global analysis:', error);
      toast({
        title: currentLanguage === 'ko' ? '글로벌 분석 생성 중 오류가 발생했습니다.' : 'Error generating global analysis.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return { generateGlobalAnalysis };
};
