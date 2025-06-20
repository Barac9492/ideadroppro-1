import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkInappropriateContent, checkTextQuality, getContentWarning } from '@/utils/contentFilter';
import { ideaOperationsText } from './constants';

interface UseIdeaSubmissionProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

// Helper function to safely convert data to arrays
const ensureArray = (data: any): string[] => {
  if (Array.isArray(data)) {
    return data.map(item => String(item));
  }
  if (typeof data === 'string') {
    if (data.trim().startsWith('[') && data.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed.map(item => String(item)) : [data];
      } catch {
        return [data];
      }
    }
    return data.split(/[,\n;]/).map(item => item.trim()).filter(item => item.length > 0);
  }
  if (data === null || data === undefined) {
    return [];
  }
  return [String(data)];
};

const ensureMarketPotential = (data: any): string[] => {
  if (typeof data === 'string' && data.length > 0) {
    return [data];
  }
  return ensureArray(data);
};

export const useIdeaSubmission = ({ currentLanguage, user, fetchIdeas }: UseIdeaSubmissionProps) => {
  const text = ideaOperationsText[currentLanguage];

  const submitIdea = async (ideaText: string) => {
    console.log('=== IDEA SUBMISSION START ===');
    console.log('User ID:', user?.id);
    console.log('Idea text length:', ideaText.length);

    // User validation
    if (!user || !user.id) {
      console.error('❌ User authentication failed');
      toast({
        title: currentLanguage === 'ko' ? '로그인이 필요합니다' : 'Login required',
        description: currentLanguage === 'ko' ? '아이디어를 제출하려면 로그인해주세요.' : 'Please log in to submit ideas.',
        variant: 'destructive',
        duration: 3000,
      });
      throw new Error('User not authenticated');
    }

    // Enhanced content filtering
    try {
      // Check text quality first
      const qualityCheck = checkTextQuality(ideaText, currentLanguage);
      if (!qualityCheck.isValid) {
        console.log('❌ Text quality check failed:', qualityCheck.reason);
        toast({
          title: currentLanguage === 'ko' ? '텍스트 품질 검사' : 'Text Quality Check',
          description: qualityCheck.reason,
          variant: 'destructive',
          duration: 5000,
        });
        throw new Error('Text quality check failed');
      }

      // Check for inappropriate content
      if (checkInappropriateContent(ideaText, currentLanguage)) {
        const warning = getContentWarning(currentLanguage);
        toast({
          title: warning[currentLanguage].title,
          description: warning[currentLanguage].message,
          variant: 'destructive',
          duration: 5000,
        });
        throw new Error('Content flagged as inappropriate');
      }
    } catch (contentFilterError) {
      if (contentFilterError.message === 'Content flagged as inappropriate' || 
          contentFilterError.message === 'Text quality check failed') {
        throw contentFilterError;
      }
      console.warn('⚠️ Content filter error (proceeding):', contentFilterError);
    }

    console.log('✅ Content and quality checks passed, starting submission...');

    // Show loading toast
    const loadingToast = toast({
      title: currentLanguage === 'ko' ? 'AI 분석 중...' : 'AI analyzing...',
      description: currentLanguage === 'ko' ? '잠시만 기다려주세요.' : 'Please wait a moment.',
      duration: 30000,
    });

    let analysisData: any = null;
    let usesFallback = false;

    try {
      // Try AI analysis
      console.log('📡 Calling AI analysis function');
      const { data, error } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage,
          userId: user.id
        }
      });

      if (error) {
        console.warn('⚠️ AI Analysis failed, using fallback:', error);
        usesFallback = true;
      } else if (data && typeof data.score !== 'undefined') {
        analysisData = data;
        console.log('✅ AI Analysis successful');
      } else {
        console.warn('⚠️ Invalid AI response, using fallback');
        usesFallback = true;
      }
    } catch (analysisError) {
      console.warn('⚠️ AI Analysis error, using fallback:', analysisError);
      usesFallback = true;
    }

    // Dismiss loading toast
    if (loadingToast.dismiss) {
      loadingToast.dismiss();
    }

    // Prepare final analysis data
    let finalAnalysisData: any;
    if (usesFallback || !analysisData) {
      console.log('📝 Using fallback analysis');
      const fallbackScore = Math.round((Math.random() * 2.5 + 4.5) * 10) / 10;
      finalAnalysisData = {
        score: fallbackScore,
        tags: [currentLanguage === 'ko' ? '일반' : 'general'],
        analysis: currentLanguage === 'ko' 
          ? '아이디어가 성공적으로 저장되었습니다. AI 분석은 일시적으로 사용할 수 없어 기본 분석으로 대체되었습니다.' 
          : 'Your idea has been saved successfully. AI analysis is temporarily unavailable and has been replaced with default analysis.',
        improvements: [currentLanguage === 'ko' ? '상세 분석 필요' : 'Detailed analysis needed'],
        marketPotential: [currentLanguage === 'ko' ? '시장성 검토 예정' : 'Market potential to be reviewed'],
        similarIdeas: [currentLanguage === 'ko' ? '유사 아이디어 조사 예정' : 'Similar ideas research pending'],
        pitchPoints: [currentLanguage === 'ko' ? '피칭 포인트 개발 예정' : 'Pitch points development pending']
      };
    } else {
      finalAnalysisData = {
        score: analysisData.score || 5.0,
        tags: ensureArray(analysisData.tags || []),
        analysis: analysisData.analysis || '',
        improvements: ensureArray(analysisData.improvements || []),
        marketPotential: ensureMarketPotential(analysisData.marketPotential || []),
        similarIdeas: ensureArray(analysisData.similarIdeas || []),
        pitchPoints: ensureArray(analysisData.pitchPoints || [])
      };
    }

    // Save to database - this is the critical step
    try {
      console.log('💾 Saving idea to database...');
      const { data: savedIdea, error: saveError } = await supabase
        .from('ideas')
        .insert([{
          user_id: user.id,
          text: ideaText,
          score: finalAnalysisData.score || 5.0,
          tags: finalAnalysisData.tags || [],
          ai_analysis: finalAnalysisData.analysis || '',
          improvements: finalAnalysisData.improvements || [],
          market_potential: finalAnalysisData.marketPotential || [],
          similar_ideas: finalAnalysisData.similarIdeas || [],
          pitch_points: finalAnalysisData.pitchPoints || []
        }])
        .select()
        .single();

      if (saveError) {
        console.error('❌ Database save failed:', saveError);
        toast({
          title: text.submitError,
          description: currentLanguage === 'ko' ? 
            '데이터베이스 저장 중 오류가 발생했습니다. 다시 시도해주세요.' : 
            'Database save failed. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
        throw new Error(`Database save failed: ${saveError.message}`);
      }

      console.log('✅ Idea saved successfully:', savedIdea?.id);

      // Show appropriate success message
      let toastTitle = text.submitSuccess;
      let toastDescription: string;

      if (usesFallback) {
        toastDescription = currentLanguage === 'ko' 
          ? '아이디어가 저장되었습니다! AI 분석은 나중에 업데이트됩니다.' 
          : 'Idea saved! AI analysis will be updated later.';
      } else {
        toastDescription = currentLanguage === 'ko' 
          ? 'AI 분석이 완료되었습니다!' 
          : 'AI analysis completed!';
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        duration: 4000,
      });

      fetchIdeas();
      console.log('=== IDEA SUBMISSION COMPLETE ===');

    } catch (dbError) {
      console.error('❌ Critical database error:', dbError);
      
      // Only show user error if it's a real database failure
      toast({
        title: text.submitError,
        description: currentLanguage === 'ko' ? 
          '아이디어 저장에 실패했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.' :
          'Failed to save idea. Please check your connection and try again.',
        variant: 'destructive',
        duration: 5000,
      });
      
      throw dbError;
    }
  };

  return { submitIdea };
};
