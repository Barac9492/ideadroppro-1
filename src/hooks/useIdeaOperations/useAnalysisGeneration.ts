
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ideaOperationsText } from './constants';

interface UseAnalysisGenerationProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useAnalysisGeneration = ({ currentLanguage, user, fetchIdeas }: UseAnalysisGenerationProps) => {
  const text = ideaOperationsText[currentLanguage];

  const generateAnalysis = async (ideaId: string, ideaText: string) => {
    if (!user) return;

    try {
      console.log('Generating analysis for idea:', ideaText);
      
      // Pre-analysis security checks
      const securityResponse = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage,
          securityCheck: true,
          userId: user.id
        }
      });

      if (securityResponse.error) {
        console.error('Security check error:', securityResponse.error);
        
        // Handle specific security violations
        if (securityResponse.error.message?.includes('RATE_LIMIT')) {
          toast({
            title: text.rateLimitError,
            variant: 'destructive',
            duration: 5000,
          });
          return;
        }
        
        if (securityResponse.error.message?.includes('DUPLICATE')) {
          toast({
            title: text.duplicateDetected,
            variant: 'destructive',
            duration: 5000,
          });
          return;
        }
        
        if (securityResponse.error.message?.includes('QUALITY')) {
          toast({
            title: text.qualityCheckFailed,
            variant: 'destructive',
            duration: 5000,
          });
          return;
        }
        
        throw new Error(text.analysisError);
      }

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage,
          userId: user.id
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(text.analysisError);
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

      const score = analysisData.score || 5;
      let toastMessage = text.analysisGenerated;
      
      if (score >= 8.5) {
        toastMessage = text.highScoreNotice;
      } else if (score < 5) {
        toastMessage = text.lowScoreNotice;
      }

      toast({
        title: toastMessage,
        duration: score >= 8.5 ? 6000 : 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: text.analysisError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return { generateAnalysis };
};
