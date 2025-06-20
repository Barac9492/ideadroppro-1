
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
    console.log('=== IDEA SUBMISSION START ===');
    console.log('User:', user ? { id: user.id, email: user.email } : 'No user');
    console.log('Idea text length:', ideaText.length);
    console.log('Language:', currentLanguage);

    if (!user) {
      console.error('❌ No user found for idea submission');
      toast({
        title: currentLanguage === 'ko' ? '로그인이 필요합니다' : 'Login required',
        description: currentLanguage === 'ko' ? '아이디어를 제출하려면 로그인해주세요.' : 'Please log in to submit ideas.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    // Content filter check with error handling
    try {
      console.log('🔍 Checking content filter...');
      const isInappropriate = checkInappropriateContent(ideaText, currentLanguage);
      console.log('Content filter result:', isInappropriate);
      
      if (isInappropriate) {
        console.log('❌ Content flagged as inappropriate');
        const warning = getContentWarning(currentLanguage);
        toast({
          title: warning[currentLanguage].title,
          description: warning[currentLanguage].message,
          variant: 'destructive',
          duration: 5000,
        });
        return;
      }
    } catch (contentFilterError) {
      console.error('⚠️ Content filter error:', contentFilterError);
      // Continue with submission even if content filter fails
    }

    console.log('✅ Content check passed, proceeding with AI analysis...');

    try {
      // Show loading toast
      const loadingToast = toast({
        title: currentLanguage === 'ko' ? 'AI 분석 중...' : 'AI analyzing...',
        description: currentLanguage === 'ko' ? '잠시만 기다려주세요.' : 'Please wait a moment.',
        duration: 30000, // 30 seconds
      });

      console.log('📡 Calling AI analysis function...');
      
      // AI 분석 요청 with detailed error handling
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
        }
      });

      // Dismiss loading toast
      if (loadingToast.dismiss) {
        loadingToast.dismiss();
      }

      console.log('📡 AI Analysis Response:', {
        hasData: !!analysisData,
        hasError: !!analysisError,
        error: analysisError,
        dataKeys: analysisData ? Object.keys(analysisData) : []
      });

      let finalAnalysisData = analysisData;
      let usesFallback = false;

      if (analysisError) {
        console.error('❌ Analysis API error:', analysisError);
        usesFallback = true;
        
        // Enhanced fallback with better randomization
        const fallbackScore = Math.round((Math.random() * 2.5 + 4.5) * 10) / 10; // 4.5-7.0 range
        finalAnalysisData = {
          score: fallbackScore,
          tags: [currentLanguage === 'ko' ? '일반' : 'general'],
          analysis: currentLanguage === 'ko' 
            ? `AI 분석을 일시적으로 사용할 수 없어 기본 분석으로 대체되었습니다. 제출하신 아이디어는 정상적으로 저장되었으며, 나중에 다시 분석을 요청하실 수 있습니다.` 
            : `AI analysis is temporarily unavailable and has been replaced with default analysis. Your idea has been saved successfully and you can request analysis again later.`,
          improvements: [currentLanguage === 'ko' ? '상세 분석 필요' : 'Detailed analysis needed'],
          marketPotential: [currentLanguage === 'ko' ? '시장성 검토 예정' : 'Market potential to be reviewed'],
          similarIdeas: [currentLanguage === 'ko' ? '유사 아이디어 조사 예정' : 'Similar ideas research pending'],
          pitchPoints: [currentLanguage === 'ko' ? '피칭 포인트 개발 예정' : 'Pitch points development pending']
        };
      } else if (!analysisData || typeof analysisData.score === 'undefined') {
        console.warn('⚠️ Invalid analysis data received:', analysisData);
        usesFallback = true;
        
        // Handle invalid response data
        const fallbackScore = Math.round((Math.random() * 2 + 5) * 10) / 10; // 5.0-7.0 range
        finalAnalysisData = {
          score: fallbackScore,
          tags: analysisData?.tags || [currentLanguage === 'ko' ? '일반' : 'general'],
          analysis: analysisData?.analysis || (currentLanguage === 'ko' 
            ? '분석 결과를 완전히 불러오지 못했습니다. 기본 분석으로 처리되었습니다.' 
            : 'Analysis results could not be fully loaded. Processed with default analysis.'),
          improvements: analysisData?.improvements || [currentLanguage === 'ko' ? '추가 분석 필요' : 'Additional analysis needed'],
          marketPotential: analysisData?.marketPotential || [currentLanguage === 'ko' ? '시장 잠재력 검토 필요' : 'Market potential review needed'],
          similarIdeas: analysisData?.similarIdeas || [currentLanguage === 'ko' ? '유사 아이디어 조사 필요' : 'Similar ideas research needed'],
          pitchPoints: analysisData?.pitchPoints || [currentLanguage === 'ko' ? '피칭 포인트 개발 필요' : 'Pitch points development needed']
        };
      }

      console.log('💾 Saving idea to database...');
      console.log('Final analysis data:', {
        score: finalAnalysisData.score,
        hasAnalysis: !!finalAnalysisData.analysis,
        tagsCount: finalAnalysisData.tags?.length || 0,
        usesFallback
      });

      // 분석 결과와 함께 저장
      const { data: savedIdea, error: saveError } = await supabase
        .from('ideas')
        .insert([{
          user_id: user.id,
          text: ideaText,
          score: finalAnalysisData.score || 5.0,
          tags: finalAnalysisData.tags || [],
          ai_analysis: finalAnalysisData.analysis,
          improvements: finalAnalysisData.improvements || [],
          market_potential: finalAnalysisData.marketPotential || [],
          similar_ideas: finalAnalysisData.similarIdeas || [],
          pitch_points: finalAnalysisData.pitchPoints || []
        }])
        .select()
        .single();

      if (saveError) {
        console.error('❌ Database save error:', saveError);
        throw new Error(`Database save failed: ${saveError.message}`);
      }

      console.log('✅ Idea saved successfully:', savedIdea?.id);

      // Show appropriate success message
      const score = finalAnalysisData.score || 5;
      let toastTitle: string;
      let toastDescription: string;

      if (usesFallback) {
        toastTitle = text.submitSuccess;
        toastDescription = text.analysisWithFallback || (currentLanguage === 'ko' 
          ? '아이디어가 저장되었지만 AI 분석이 일시적으로 제한됩니다.' 
          : 'Idea saved but AI analysis is temporarily limited.');
      } else if (score < 5) {
        toastTitle = text.lowScoreNotice || (currentLanguage === 'ko' 
          ? '아이디어가 제출되었습니다' 
          : 'Idea submitted');
        toastDescription = currentLanguage === 'ko' 
          ? '더 구체적인 아이디어로 점수를 높여보세요!' 
          : 'Try to improve your score with more specific ideas!';
      } else {
        toastTitle = text.submitSuccess;
        toastDescription = currentLanguage === 'ko' 
          ? 'AI 분석이 완료되었습니다!' 
          : 'AI analysis completed!';
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        duration: 4000,
      });

      console.log('🔄 Refreshing ideas list...');
      fetchIdeas();
      console.log('=== IDEA SUBMISSION COMPLETE ===');

    } catch (error) {
      console.error('❌ Critical error in idea submission:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Show user-friendly error message
      const errorMessage = error.message || 'Unknown error occurred';
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection');
      
      toast({
        title: text.submitError || (currentLanguage === 'ko' ? '제출 오류' : 'Submission Error'),
        description: isNetworkError 
          ? (currentLanguage === 'ko' 
              ? '네트워크 연결을 확인하고 다시 시도해주세요.' 
              : 'Please check your network connection and try again.')
          : (currentLanguage === 'ko' 
              ? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
              : 'A temporary error occurred. Please try again in a moment.'),
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  return { submitIdea };
};
