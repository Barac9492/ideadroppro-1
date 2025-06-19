
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseGlobalAnalysisProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useGlobalAnalysis = ({ currentLanguage, user, fetchIdeas }: UseGlobalAnalysisProps) => {
  const generateGlobalAnalysis = async (ideaId: string) => {
    if (!user) return;

    try {
      console.log('Generating global analysis for idea ID:', ideaId);
      
      // First, get the idea text from the database
      const { data: ideaData, error: ideaError } = await supabase
        .from('ideas')
        .select('text')
        .eq('id', ideaId)
        .single();

      if (ideaError) {
        console.error('Error fetching idea:', ideaError);
        throw new Error('아이디어를 불러오는 중 오류가 발생했습니다.');
      }

      console.log('Fetched idea text:', ideaData.text);
      
      const { data: globalAnalysisData, error: globalAnalysisError } = await supabase.functions.invoke('analyze-global-market', {
        body: { 
          ideaText: ideaData.text,
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
