
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';

interface IdeaOperationsProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useIdeaOperations = ({ currentLanguage, user, fetchIdeas }: IdeaOperationsProps) => {
  const text = {
    ko: {
      submitSuccess: '아이디어가 성공적으로 제출되었습니다!',
      submitError: '아이디어 제출 중 오류가 발생했습니다.',
      analysisGenerated: 'AI 분석이 생성되었습니다!',
      analysisError: 'AI 분석 생성 중 오류가 발생했습니다.',
      verdictSaved: 'VC 평가가 저장되었습니다!',
      verdictError: 'VC 평가 저장 중 오류가 발생했습니다.',
      contentBlocked: '부적절한 콘텐츠가 감지되어 아이디어를 제출할 수 없습니다.',
    },
    en: {
      submitSuccess: 'Idea submitted successfully!',
      submitError: 'Error occurred while submitting idea.',
      analysisGenerated: 'AI analysis generated successfully!',
      analysisError: 'Error occurred while generating AI analysis.',
      verdictSaved: 'VC verdict saved successfully!',
      verdictError: 'Error occurred while saving VC verdict.',
      contentBlocked: 'Inappropriate content detected. Idea cannot be submitted.',
    }
  };

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
        const { data, error } = await supabase
          .from('ideas')
          .insert([{
            user_id: user.id,
            text: ideaText,
            score: Math.round((Math.random() * 3 + 7) * 10) / 10,
            tags: ['일반'],
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
          title: text[currentLanguage].submitSuccess,
          description: currentLanguage === 'ko' 
            ? 'AI 분석은 실패했지만 아이디어가 저장되었습니다.' 
            : 'AI analysis failed but idea was saved.',
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
          score: analysisData.score || Math.round((Math.random() * 3 + 7) * 10) / 10,
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

      toast({
        title: text[currentLanguage].submitSuccess,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: text[currentLanguage].submitError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const generateAnalysis = async (ideaId: string, ideaText: string) => {
    if (!user) return;

    try {
      console.log('Generating analysis for idea:', ideaText);
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(text[currentLanguage].analysisError);
      }

      console.log('Analysis result:', analysisData);

      const { error } = await supabase
        .from('ideas')
        .update({
          score: analysisData.score,
          tags: analysisData.tags,
          ai_analysis: analysisData.analysis,
          improvements: analysisData.improvements,
          market_potential: analysisData.marketPotential,
          similar_ideas: analysisData.similarIdeas,
          pitch_points: analysisData.pitchPoints
        })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].analysisGenerated,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: text[currentLanguage].analysisError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ideas')
        .update({ final_verdict: verdict })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].verdictSaved,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error saving verdict:', error);
      toast({
        title: text[currentLanguage].verdictError,  
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return {
    submitIdea,
    generateAnalysis,
    saveFinalVerdict
  };
};
