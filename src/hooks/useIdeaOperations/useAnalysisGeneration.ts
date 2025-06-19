
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
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
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
      const toastMessage = score < 5 
        ? text.lowScoreNotice
        : text.analysisGenerated;

      toast({
        title: toastMessage,
        duration: 3000,
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
