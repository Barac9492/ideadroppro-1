
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkTextQuality, checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';

interface UseIdeaSubmissionProps {
  currentLanguage: 'ko' | 'en';
  user: User | null;
  fetchIdeas: () => Promise<void>;
}

const text = {
  ko: {
    submitting: '제출 중...',
    success: '아이디어가 성공적으로 제출되었습니다!',
    loginRequired: '아이디어를 제출하려면 로그인이 필요합니다',
    submissionError: '아이디어 제출 중 오류가 발생했습니다',
    analysisError: 'AI 분석 중 오류가 발생했습니다',
    tryAgain: '다시 시도해주세요'
  },
  en: {
    submitting: 'Submitting...',
    success: 'Idea submitted successfully!',
    loginRequired: 'Please login to submit ideas',
    submissionError: 'Error submitting idea',
    analysisError: 'Error during AI analysis',
    tryAgain: 'Please try again'
  }
};

export const useIdeaSubmission = ({ currentLanguage, user, fetchIdeas }: UseIdeaSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitIdea = async (ideaText: string) => {
    // Strict authentication check
    if (!user) {
      toast({
        title: text[currentLanguage].loginRequired,
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    }

    // Validate text quality on frontend
    const qualityCheck = checkTextQuality(ideaText, currentLanguage);
    if (!qualityCheck.isValid) {
      toast({
        title: qualityCheck.reason,
        variant: 'destructive',
        duration: 3000,
      });
      return false;
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
      return false;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting idea for user:', user.id);
      
      // Get current session to include authorization header
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      // Call the analyze-idea edge function with proper authorization
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: {
          ideaText,
          language: currentLanguage,
          userId: user.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(analysisError.message || 'Analysis failed');
      }

      if (!analysisData) {
        throw new Error('No analysis data received');
      }

      console.log('Analysis completed:', analysisData.score);

      // Insert the idea into the database with strict user_id check
      const { error: insertError } = await supabase
        .from('ideas')
        .insert({
          text: ideaText,
          score: analysisData.score,
          tags: analysisData.tags || [],
          ai_analysis: analysisData.analysis,
          improvements: analysisData.improvements || [],
          market_potential: analysisData.marketPotential || [],
          similar_ideas: analysisData.similarIdeas || [],
          pitch_points: analysisData.pitchPoints || [],
          user_id: user.id, // Explicitly set user_id
        });

      if (insertError) {
        console.error('Database insertion error:', insertError);
        throw insertError;
      }

      console.log('✅ Idea submitted successfully');
      
      toast({
        title: text[currentLanguage].success,
        duration: 3000,
      });

      // Refresh ideas list
      await fetchIdeas();
      return true;

    } catch (error: any) {
      console.error('❌ Error submitting idea:', error);
      
      const errorMessage = error.message || text[currentLanguage].submissionError;
      const isAuthError = error.message?.includes('Authentication') || error.message?.includes('sign in');
      
      toast({
        title: isAuthError ? text[currentLanguage].loginRequired : text[currentLanguage].submissionError,
        description: isAuthError ? 'Please sign in and try again' : `${errorMessage}. ${text[currentLanguage].tryAgain}`,
        variant: 'destructive',
        duration: 5000,
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitIdea,
    isSubmitting
  };
};
