
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';
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
    // Try to parse if it looks like JSON array
    if (data.trim().startsWith('[') && data.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed.map(item => String(item)) : [data];
      } catch {
        return [data];
      }
    }
    // Split by common delimiters if it's a string
    return data.split(/[,\n;]/).map(item => item.trim()).filter(item => item.length > 0);
  }
  if (data === null || data === undefined) {
    return [];
  }
  return [String(data)];
};

// Helper function to safely convert market potential (can be string or array)
const ensureMarketPotential = (data: any): string[] => {
  if (typeof data === 'string' && data.length > 0) {
    // If it's a single long string, treat it as one market potential item
    return [data];
  }
  return ensureArray(data);
};

export const useIdeaSubmission = ({ currentLanguage, user, fetchIdeas }: UseIdeaSubmissionProps) => {
  const text = ideaOperationsText[currentLanguage];

  const submitIdea = async (ideaText: string) => {
    console.log('=== IDEA SUBMISSION START ===');
    console.log('User object:', user);
    console.log('User ID:', user?.id);
    console.log('User email:', user?.email);
    console.log('Idea text length:', ideaText.length);
    console.log('Language:', currentLanguage);

    // Enhanced user validation
    if (!user) {
      console.error('❌ No user found for idea submission');
      toast({
        title: currentLanguage === 'ko' ? '로그인이 필요합니다' : 'Login required',
        description: currentLanguage === 'ko' ? '아이디어를 제출하려면 로그인해주세요.' : 'Please log in to submit ideas.',
        variant: 'destructive',
        duration: 3000,
      });
      throw new Error('User not authenticated');
    }

    if (!user.id) {
      console.error('❌ User ID is missing');
      toast({
        title: currentLanguage === 'ko' ? '사용자 인증 오류' : 'User authentication error',
        description: currentLanguage === 'ko' ? '사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.' : 'Unable to verify user information. Please log in again.',
        variant: 'destructive',
        duration: 3000,
      });
      throw new Error('User ID missing');
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
        throw new Error('Content flagged as inappropriate');
      }
    } catch (contentFilterError) {
      console.error('⚠️ Content filter error:', contentFilterError);
      if (contentFilterError.message === 'Content flagged as inappropriate') {
        throw contentFilterError;
      }
      // Continue with submission even if content filter fails
    }

    console.log('✅ Content check passed, proceeding with AI analysis...');

    let finalAnalysisData: any;
    let usesFallback = false;

    try {
      // Show loading toast
      const loadingToast = toast({
        title: currentLanguage === 'ko' ? 'AI 분석 중...' : 'AI analyzing...',
        description: currentLanguage === 'ko' ? '잠시만 기다려주세요.' : 'Please wait a moment.',
        duration: 30000, // 30 seconds
      });

      console.log('📡 Calling AI analysis function with user ID:', user.id);
      
      // AI 분석 요청 with detailed error handling and proper user ID
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage,
          userId: user.id // Ensure user ID is properly passed
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
        dataKeys: analysisData ? Object.keys(analysisData) : [],
        userId: user.id
      });

      if (analysisError) {
        console.error('❌ Analysis API error:', analysisError);
        
        // Handle specific error types
        if (analysisError.message?.includes('User not authenticated') || analysisError.message?.includes('User ID missing')) {
          toast({
            title: text.submitError,
            description: currentLanguage === 'ko' ? '사용자 인증에 실패했습니다. 다시 로그인해주세요.' : 'User authentication failed. Please log in again.',
            variant: 'destructive',
            duration: 5000,
          });
          throw new Error('Authentication failed during analysis');
        }
        
        usesFallback = true;
      } else if (!analysisData || typeof analysisData.score === 'undefined') {
        console.warn('⚠️ Invalid analysis data received:', analysisData);
        usesFallback = true;
      }

      // Process analysis data with proper type conversion
      if (usesFallback || !analysisData) {
        console.log('Using fallback analysis data');
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
      } else {
        // Convert received data to proper formats
        console.log('Converting analysis data to proper formats');
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

      console.log('💾 Saving idea to database...');
      console.log('Final analysis data after conversion:', {
        score: finalAnalysisData.score,
        hasAnalysis: !!finalAnalysisData.analysis,
        tagsCount: finalAnalysisData.tags?.length || 0,
        improvementsCount: finalAnalysisData.improvements?.length || 0,
        marketPotentialCount: finalAnalysisData.marketPotential?.length || 0,
        similarIdeasCount: finalAnalysisData.similarIdeas?.length || 0,
        pitchPointsCount: finalAnalysisData.pitchPoints?.length || 0,
        usesFallback,
        userId: user.id
      });

      // 분석 결과와 함께 저장 - with proper data validation
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
        console.error('❌ Database save error:', saveError);
        console.error('Save error details:', {
          message: saveError.message,
          details: saveError.details,
          hint: saveError.hint,
          code: saveError.code
        });
        
        // Show user-friendly error message
        toast({
          title: text.submitError,
          description: currentLanguage === 'ko' ? 
            '데이터베이스 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' : 
            'An error occurred while saving to database. Please try again later.',
          variant: 'destructive',
          duration: 5000,
        });
        throw new Error(`Database save failed: ${saveError.message}`);
      }

      console.log('✅ Idea saved successfully:', savedIdea?.id);

      // Show appropriate success message
      const score = finalAnalysisData.score || 5;
      let toastTitle: string;
      let toastDescription: string;

      if (usesFallback) {
        toastTitle = text.submitSuccess;
        toastDescription = text.analysisWithFallback;
      } else if (score < 5) {
        toastTitle = text.lowScoreNotice;
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
      console.error('User ID at error time:', user?.id);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Don't show error if already handled (authentication errors, inappropriate content)
      if (error.message === 'User not authenticated' || 
          error.message === 'User ID missing' || 
          error.message === 'Authentication failed during analysis' ||
          error.message === 'Content flagged as inappropriate') {
        throw error;
      }

      // Show user-friendly error message for other errors
      const errorMessage = error.message || 'Unknown error occurred';
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection');
      const isDatabaseError = errorMessage.includes('Database save failed') || errorMessage.includes('malformed array');
      
      let userMessage = text.retryLater;
      if (isNetworkError) {
        userMessage = text.networkError;
      } else if (isDatabaseError) {
        userMessage = currentLanguage === 'ko' ? 
          '데이터 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' :
          'A data processing error occurred. Please try again later.';
      }
      
      toast({
        title: text.submitError,
        description: userMessage,
        variant: 'destructive',
        duration: 5000,
      });
      
      throw error;
    }
  };

  return { submitIdea };
};
