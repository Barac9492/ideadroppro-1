
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseBulkAnalysisProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => Promise<void>;
}

export const useBulkAnalysis = ({ currentLanguage, user, fetchIdeas }: UseBulkAnalysisProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const text = {
    ko: {
      starting: '일괄 분석을 시작합니다...',
      analyzing: '분석 중... ({current}/{total})',
      completed: '일괄 분석이 완료되었습니다!',
      error: '일괄 분석 중 오류가 발생했습니다',
      noIdeas: '분석할 아이디어가 없습니다'
    },
    en: {
      starting: 'Starting bulk analysis...',
      analyzing: 'Analyzing... ({current}/{total})',
      completed: 'Bulk analysis completed!',
      error: 'Error during bulk analysis',
      noIdeas: 'No ideas to analyze'
    }
  };

  const analyzeUnanalyzedIdeas = async () => {
    if (!user) return;

    setAnalyzing(true);
    
    try {
      // Get ideas with score 0 or no AI analysis
      const { data: unanalyzedIdeas, error: fetchError } = await supabase
        .from('ideas')
        .select('id, text, user_id')
        .or('score.eq.0,ai_analysis.is.null')
        .eq('seed', false);

      if (fetchError) throw fetchError;

      if (!unanalyzedIdeas || unanalyzedIdeas.length === 0) {
        toast({
          title: text[currentLanguage].noIdeas,
          duration: 3000,
        });
        return;
      }

      console.log(`🔄 Starting bulk analysis for ${unanalyzedIdeas.length} ideas`);
      
      setProgress({ current: 0, total: unanalyzedIdeas.length });
      
      toast({
        title: text[currentLanguage].starting,
        duration: 2000,
      });

      // Process ideas one by one to avoid rate limiting
      for (let i = 0; i < unanalyzedIdeas.length; i++) {
        const idea = unanalyzedIdeas[i];
        setProgress({ current: i + 1, total: unanalyzedIdeas.length });
        
        toast({
          title: text[currentLanguage].analyzing
            .replace('{current}', (i + 1).toString())
            .replace('{total}', unanalyzedIdeas.length.toString()),
          duration: 1000,
        });

        try {
          const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
            body: { 
              ideaText: idea.text,
              language: currentLanguage,
              userId: user.id
            }
          });

          if (analysisError) {
            console.error(`❌ Analysis failed for idea ${idea.id}:`, analysisError);
            // Set default score for failed analysis
            await supabase
              .from('ideas')
              .update({ score: 5.0 })
              .eq('id', idea.id);
            continue;
          }

          // Update idea with analysis results
          await supabase
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
            .eq('id', idea.id);

          console.log(`✅ Analysis completed for idea ${idea.id}`);
          
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Error analyzing idea ${idea.id}:`, error);
          // Continue with next idea
        }
      }

      toast({
        title: text[currentLanguage].completed,
        duration: 4000,
      });

      // Refresh ideas list
      await fetchIdeas();

    } catch (error) {
      console.error('❌ Bulk analysis error:', error);
      toast({
        title: text[currentLanguage].error,
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setAnalyzing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return {
    analyzeUnanalyzedIdeas,
    analyzing,
    progress
  };
};
