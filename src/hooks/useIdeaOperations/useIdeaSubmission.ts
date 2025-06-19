
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';
import { ideaOperationsText } from './constants';

interface UseIdeaSubmissionProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useIdeaSubmission = ({ currentLanguage, user, fetchIdeas }: UseIdeaSubmissionProps) => {
  const text = ideaOperationsText[currentLanguage];

  const submitIdea = async (ideaText: string) => {
    if (!user) return;

    // Check for inappropriate content
    if (checkInappropriateContent(ideaText, currentLanguage)) {
      const warning = getContentWarning(currentLanguage);
      toast({
        title: warning[currentLanguage].title,
        description: warning[currentLanguage].message,
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    try {
      console.log('Requesting AI analysis for:', ideaText);
      
      // AI 분석 요청
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        // 분석 실패 시 기본값으로 아이디어만 저장
        const fallbackScore = Math.round((Math.random() * 2 + 4) * 10) / 10; // 4.0-6.0 range
        const { data, error } = await supabase
          .from('ideas')
          .insert([{
            user_id: user.id,
            text: ideaText,
            score: fallbackScore,
            tags: [currentLanguage === 'ko' ? '일반' : 'general'],
            ai_analysis: currentLanguage === 'ko' 
              ? 'AI 분석을 불러올 수 없어 기본 분석으로 대체되었습니다.' 
              : 'AI analysis failed, replaced with default analysis.',
            improvements: [currentLanguage === 'ko' ? '추후 분석 필요' : 'Further analysis needed'],
            market_potential: [currentLanguage === 'ko' ? '시장성 검토 필요' : 'Market potential review needed'],
            similar_ideas: [currentLanguage === 'ko' ? '유사 아이디어 조사 필요' : 'Similar ideas research needed'],
            pitch_points: [currentLanguage === 'ko' ? '피칭 포인트 개발 필요' : 'Pitch points development needed']
          }])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: text.submitSuccess,
          description: text.analysisWithFallback,
          duration: 3000,
        });

        fetchIdeas();
        return;
      }

      console.log('Analysis result:', analysisData);

      // 분석 성공 시 결과와 함께 저장
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          user_id: user.id,
          text: ideaText,
          score: analysisData.score || Math.round((Math.random() * 2 + 4) * 10) / 10,
          tags: analysisData.tags || [],
          ai_analysis: analysisData.analysis,
          improvements: analysisData.improvements,
          market_potential: analysisData.marketPotential,
          similar_ideas: analysisData.similarIdeas,
          pitch_points: analysisData.pitchPoints
        }])
        .select()
        .single();

      if (error) throw error;

      // Show different messages based on score
      const score = analysisData.score || 5;
      const toastMessage = score < 5 
        ? text.lowScoreNotice
        : text.submitSuccess;

      toast({
        title: toastMessage,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: text.submitError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return { submitIdea };
};
