
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseIdeaSubmissionProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => Promise<void>;
}

export const useIdeaSubmission = ({ currentLanguage, user, fetchIdeas }: UseIdeaSubmissionProps) => {
  const [submitting, setSubmitting] = useState(false);

  const text = {
    ko: {
      submitting: '제출 중...',
      submitted: '아이디어가 성공적으로 제출되었습니다!',
      error: '아이디어 제출 중 오류가 발생했습니다',
      loginRequired: '아이디어를 제출하려면 로그인이 필요합니다',
      tooShort: '아이디어는 최소 10자 이상이어야 합니다',
      processing: '아이디어를 처리하고 있습니다...'
    },
    en: {
      submitting: 'Submitting...',
      submitted: 'Idea submitted successfully!',
      error: 'Error submitting idea',
      loginRequired: 'Please log in to submit an idea',
      tooShort: 'Idea must be at least 10 characters long',
      processing: 'Processing your idea...'
    }
  };

  const submitIdea = async (ideaText: string) => {
    // Enforce authentication
    if (!user) {
      toast({
        title: text[currentLanguage].loginRequired,
        variant: 'destructive',
        duration: 3000,
      });
      throw new Error('Authentication required');
    }

    // Validate idea text
    const trimmedText = ideaText.trim();
    if (trimmedText.length < 10) {
      toast({
        title: text[currentLanguage].tooShort,
        variant: 'destructive',
        duration: 3000,
      });
      throw new Error('Idea too short');
    }

    setSubmitting(true);
    
    try {
      console.log('💡 Submitting idea by user:', user.id);
      
      // Show processing toast
      toast({
        title: text[currentLanguage].processing,
        duration: 2000,
      });

      const { data, error } = await supabase
        .from('ideas')
        .insert({
          text: trimmedText,
          user_id: user.id,
          score: 0,
          tags: [],
          likes_count: 0,
          seed: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error submitting idea:', error);
        throw error;
      }

      console.log('✅ Idea submitted successfully:', data.id);

      toast({
        title: text[currentLanguage].submitted,
        duration: 3000,
      });

      // Refresh ideas list
      await fetchIdeas();

    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      
      toast({
        title: text[currentLanguage].error,
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
      
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitIdea,
    submitting
  };
};
