
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
      analyzing: 'AI가 분석 중입니다...',
      submitted: '아이디어가 성공적으로 제출되었습니다!',
      error: '아이디어 제출 중 오류가 발생했습니다',
      loginRequired: '아이디어를 제출하려면 로그인이 필요합니다',
      tooShort: '아이디어는 최소 10자 이상이어야 합니다',
      processing: '아이디어를 처리하고 있습니다...',
      analysisError: 'AI 분석 중 오류가 발생했지만 아이디어는 저장되었습니다'
    },
    en: {
      submitting: 'Submitting...',
      analyzing: 'AI is analyzing...',
      submitted: 'Idea submitted successfully!',
      error: 'Error submitting idea',
      loginRequired: 'Please log in to submit an idea',
      tooShort: 'Idea must be at least 10 characters long',
      processing: 'Processing your idea...',
      analysisError: 'AI analysis failed but idea was saved'
    }
  };

  const generateAnalysisForIdea = async (ideaId: string, ideaText: string) => {
    try {
      console.log('🔄 Starting AI analysis for idea:', ideaId);
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage,
          userId: user.id
        }
      });

      if (analysisError) {
        console.error('❌ Analysis error:', analysisError);
        throw new Error('Analysis failed');
      }

      console.log('✅ Analysis completed:', analysisData);

      // Update the idea with analysis results
      const { error: updateError } = await supabase
        .from('ideas')
        .update({
          score: analysisData.score || 5.0,
          tags: analysisData.tags || [],
          ai_analysis: analysisData.analysis,
          improvements: analysisData.improvements,
          market_potential: analysisData.marketPotential,
          similar_ideas: analysisData.similarIdeas,
          pitch_points: analysisData.pitchPoints
        })
        .eq('id', ideaId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw new Error('Failed to update idea with analysis');
      }

      console.log('✅ Idea updated with analysis results');
      return analysisData;
    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      
      // Set a default score if analysis fails
      await supabase
        .from('ideas')
        .update({ score: 5.0 })
        .eq('id', ideaId);
      
      throw error;
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

      // First, insert the idea
      const { data: ideaData, error: insertError } = await supabase
        .from('ideas')
        .insert({
          text: trimmedText,
          user_id: user.id,
          score: 0, // Will be updated after analysis
          tags: [],
          likes_count: 0,
          seed: false
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error inserting idea:', insertError);
        throw insertError;
      }

      console.log('✅ Idea inserted successfully:', ideaData.id);

      // Show analysis toast
      toast({
        title: text[currentLanguage].analyzing,
        duration: 3000,
      });

      // Generate AI analysis automatically
      try {
        await generateAnalysisForIdea(ideaData.id, trimmedText);
        
        toast({
          title: text[currentLanguage].submitted,
          duration: 3000,
        });
      } catch (analysisError) {
        console.error('❌ Analysis failed but idea was saved:', analysisError);
        
        toast({
          title: text[currentLanguage].analysisError,
          variant: 'default',
          duration: 4000,
        });
      }

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
