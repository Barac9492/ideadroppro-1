
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
      console.log('🔄 Starting bulk analysis process...');
      
      // Get ideas with score 0 or no AI analysis
      const { data: unanalyzedIdeas, error: fetchError } = await supabase
        .from('ideas')
        .select('id, text, user_id, score, ai_analysis')
        .or('score.eq.0,ai_analysis.is.null')
        .eq('seed', false)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Error fetching unanalyzed ideas:', fetchError);
        throw fetchError;
      }

      console.log('📊 Found ideas for analysis:', unanalyzedIdeas?.length || 0);

      if (!unanalyzedIdeas || unanalyzedIdeas.length === 0) {
        toast({
          title: text[currentLanguage].noIdeas,
          duration: 3000,
        });
        return;
      }

      console.log(`🚀 Starting bulk analysis for ${unanalyzedIdeas.length} ideas`);
      
      setProgress({ current: 0, total: unanalyzedIdeas.length });
      
      toast({
        title: text[currentLanguage].starting,
        duration: 2000,
      });

      let successCount = 0;
      let errorCount = 0;

      // Process ideas one by one to avoid rate limiting
      for (let i = 0; i < unanalyzedIdeas.length; i++) {
        const idea = unanalyzedIdeas[i];
        setProgress({ current: i + 1, total: unanalyzedIdeas.length });
        
        console.log(`🔄 Analyzing idea ${i + 1}/${unanalyzedIdeas.length}: ${idea.id}`);
        
        toast({
          title: text[currentLanguage].analyzing
            .replace('{current}', (i + 1).toString())
            .replace('{total}', unanalyzedIdeas.length.toString()),
          duration: 1000,
        });

        try {
          console.log('📝 Sending idea to analysis function:', idea.text.substring(0, 50) + '...');
          
          const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
            body: { 
              ideaText: idea.text,
              language: currentLanguage,
              userId: user.id
            }
          });

          if (analysisError) {
            console.error(`❌ Analysis function error for idea ${idea.id}:`, analysisError);
            errorCount++;
            
            // Set fallback score for failed analysis
            await supabase
              .from('ideas')
              .update({ 
                score: 4.5, // Fallback score that's definitely not 0
                ai_analysis: currentLanguage === 'ko' 
                  ? '분석 중 오류가 발생했지만 기본 점수를 적용했습니다.'
                  : 'Analysis failed but applied default score.'
              })
              .eq('id', idea.id);
            
            continue;
          }

          console.log('✅ Analysis successful for idea:', idea.id, 'Score:', analysisData.score);

          // Ensure we have a valid score
          const finalScore = analysisData.score && analysisData.score > 0 ? analysisData.score : 5.0;

          // Update idea with analysis results
          const { error: updateError } = await supabase
            .from('ideas')
            .update({
              score: finalScore,
              tags: analysisData.tags || [],
              ai_analysis: analysisData.analysis || 'Analysis completed',
              improvements: analysisData.improvements || [],
              market_potential: analysisData.marketPotential || [],
              similar_ideas: analysisData.similarIdeas || [],
              pitch_points: analysisData.pitchPoints || []
            })
            .eq('id', idea.id);

          if (updateError) {
            console.error(`❌ Database update error for idea ${idea.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`✅ Successfully updated idea ${idea.id} with score ${finalScore}`);
            successCount++;
          }
          
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1500));
          
        } catch (error) {
          console.error(`❌ Error analyzing idea ${idea.id}:`, error);
          errorCount++;
          
          // Set fallback score for error cases
          try {
            await supabase
              .from('ideas')
              .update({ 
                score: 4.0,
                ai_analysis: currentLanguage === 'ko' 
                  ? '분석 중 오류가 발생했지만 기본 점수를 적용했습니다.'
                  : 'Analysis failed but applied default score.'
              })
              .eq('id', idea.id);
          } catch (updateError) {
            console.error(`❌ Failed to set fallback score for idea ${idea.id}:`, updateError);
          }
        }
      }

      console.log(`🎯 Bulk analysis completed. Success: ${successCount}, Errors: ${errorCount}`);

      toast({
        title: text[currentLanguage].completed + (errorCount > 0 ? ` (${errorCount}개 오류 발생)` : ''),
        duration: 4000,
      });

      // Refresh ideas list
      console.log('🔄 Refreshing ideas list...');
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
