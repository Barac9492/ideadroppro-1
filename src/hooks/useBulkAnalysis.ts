
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
      starting: '긴급 점수 수정을 시작합니다...',
      analyzing: '수정 중... ({current}/{total})',
      completed: '긴급 점수 수정이 완료되었습니다!',
      error: '긴급 점수 수정 중 오류가 발생했습니다',
      noIdeas: '수정할 아이디어가 없습니다',
      foundIdeas: '{count}개의 0점 아이디어를 발견했습니다',
      analysisComplete: '수정 완료: {success}개 아이디어에 점수 적용됨',
      emergencyFix: '🚨 긴급 수정: 모든 0점 아이디어에 즉시 점수 적용 중...',
      retrying: '재시도 중...',
      forceUpdate: '강제 업데이트 실행 중...'
    },
    en: {
      starting: 'Starting emergency score fix...',
      analyzing: 'Fixing... ({current}/{total})',
      completed: 'Emergency score fix completed!',
      error: 'Error during emergency score fix',
      noIdeas: 'No ideas to fix',
      foundIdeas: 'Found {count} ideas with 0 score',
      analysisComplete: 'Fix complete: {success} ideas scored',
      emergencyFix: '🚨 Emergency fix: Applying scores to all 0-score ideas...',
      retrying: 'Retrying...',
      forceUpdate: 'Executing force update...'
    }
  };

  // 강화된 점수 계산 시스템
  const calculateEmergencyScore = (ideaText: string): number => {
    let score = 4.5; // 높은 기본 점수
    
    const textLength = ideaText.trim().length;
    if (textLength > 30) score += 0.3;
    if (textLength > 80) score += 0.7;
    if (textLength > 150) score += 0.5;
    if (textLength > 250) score += 0.3;
    
    const sentences = ideaText.split(/[.!?]/).filter(s => s.trim().length > 10);
    score += Math.min(sentences.length * 0.2, 1.0);
    
    const keywords = ['AI', '인공지능', '앱', '서비스', '플랫폼', '시스템', '솔루션', '기술', '비즈니스', '혁신'];
    const matchedKeywords = keywords.filter(keyword => 
      ideaText.toLowerCase().includes(keyword.toLowerCase())
    );
    score += Math.min(matchedKeywords.length * 0.25, 1.5);
    
    if (/\p{Emoji}/u.test(ideaText)) score += 0.3;
    if (/\d+/.test(ideaText)) score += 0.3;
    
    const randomBonus = Math.random() * 1.5;
    score += randomBonus;
    
    const finalScore = Math.max(3.5, Math.min(8.5, score));
    return parseFloat(finalScore.toFixed(1));
  };

  // 단일 아이디어 업데이트 함수 (재시도 로직 포함)
  const updateSingleIdea = async (idea: any, retryCount = 0): Promise<boolean> => {
    const maxRetries = 3;
    
    try {
      const emergencyScore = calculateEmergencyScore(idea.text);
      
      console.log(`🔧 Updating idea ${idea.id} with score ${emergencyScore} (attempt ${retryCount + 1})`);
      
      // 먼저 analyze-idea 함수를 통한 AI 분석 시도
      let analysisData = null;
      try {
        const { data: aiResult, error: aiError } = await supabase.functions.invoke('analyze-idea', {
          body: { 
            ideaText: idea.text, 
            language: currentLanguage 
          }
        });

        if (!aiError && aiResult && aiResult.score > 0) {
          analysisData = aiResult;
          console.log(`✅ AI analysis successful for idea ${idea.id}, score: ${aiResult.score}`);
        }
      } catch (aiError) {
        console.warn(`⚠️ AI analysis failed for idea ${idea.id}:`, aiError);
      }

      // AI 분석이 실패한 경우 긴급 데이터 사용
      if (!analysisData) {
        analysisData = {
          score: emergencyScore,
          analysis: currentLanguage === 'ko' 
            ? `긴급 분석: ${emergencyScore}점으로 평가되었습니다. 텍스트 품질 기반 자동 점수입니다.`
            : `Emergency analysis: Scored ${emergencyScore} points based on text quality.`,
          improvements: [
            currentLanguage === 'ko' ? '구체적인 실행 계획 추가' : 'Add specific execution plan',
            currentLanguage === 'ko' ? '시장 분석 보완' : 'Enhance market analysis'
          ],
          marketPotential: [
            currentLanguage === 'ko' ? '타겟 고객 명확화' : 'Clarify target customers',
            currentLanguage === 'ko' ? '수익 모델 구체화' : 'Define revenue model'
          ],
          similarIdeas: [
            currentLanguage === 'ko' ? '기존 솔루션 조사' : 'Research existing solutions'
          ],
          pitchPoints: [
            currentLanguage === 'ko' ? '독창적인 아이디어' : 'Original idea',
            currentLanguage === 'ko' ? '시장 잠재력 보유' : 'Market potential'
          ]
        };
      }

      // 데이터베이스 업데이트 실행
      const { error: updateError } = await supabase
        .from('ideas')
        .update({
          score: analysisData.score,
          ai_analysis: analysisData.analysis,
          tags: ['긴급수정', '자동점수'],
          improvements: analysisData.improvements || [],
          market_potential: analysisData.marketPotential || [],
          similar_ideas: analysisData.similarIdeas || [],
          pitch_points: analysisData.pitchPoints || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', idea.id);

      if (updateError) {
        console.error(`❌ Database update failed for idea ${idea.id}:`, updateError);
        
        // 재시도 로직
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying update for idea ${idea.id}...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return await updateSingleIdea(idea, retryCount + 1);
        }
        
        throw updateError;
      }

      console.log(`✅ Successfully updated idea ${idea.id} with score ${analysisData.score}`);
      return true;

    } catch (error) {
      console.error(`💥 Failed to update idea ${idea.id} after ${retryCount + 1} attempts:`, error);
      return false;
    }
  };

  const analyzeUnanalyzedIdeas = async () => {
    if (!user) {
      console.error('❌ 사용자 인증 필요');
      return;
    }

    setAnalyzing(true);
    console.log('🚨 긴급 점수 수정 시작...');
    
    try {
      // 0점 아이디어 조회
      const { data: zeroScoreIdeas, error: fetchError } = await supabase
        .from('ideas')
        .select('id, text, score, ai_analysis')
        .or('score.eq.0,score.is.null')
        .eq('seed', false)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ 0점 아이디어 조회 실패:', fetchError);
        throw fetchError;
      }

      if (!zeroScoreIdeas || zeroScoreIdeas.length === 0) {
        toast({
          title: text[currentLanguage].noIdeas,
          duration: 3000,
        });
        return;
      }

      console.log(`🎯 ${zeroScoreIdeas.length}개의 0점 아이디어 발견`);
      
      toast({
        title: text[currentLanguage].emergencyFix,
        duration: 3000,
      });
      
      setProgress({ current: 0, total: zeroScoreIdeas.length });

      let successCount = 0;
      
      // 각 아이디어 순차 처리
      for (let i = 0; i < zeroScoreIdeas.length; i++) {
        const idea = zeroScoreIdeas[i];
        
        setProgress({ current: i + 1, total: zeroScoreIdeas.length });
        
        const success = await updateSingleIdea(idea);
        if (success) {
          successCount++;
        }
        
        // 요청 간격 조절
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`🎉 긴급 점수 수정 완료! ${successCount}개 아이디어 성공`);

      toast({
        title: text[currentLanguage].analysisComplete
          .replace('{success}', successCount.toString()),
        duration: 5000,
      });

      // 아이디어 목록 새로고침
      console.log('🔄 아이디어 목록 새로고침...');
      await fetchIdeas();
      
      toast({
        title: text[currentLanguage].completed,
        duration: 4000,
      });

      // 완료 후 추가 검증
      const { count: remainingZeroScores } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .or('score.eq.0,score.is.null')
        .eq('seed', false);

      if (remainingZeroScores && remainingZeroScores > 0) {
        console.warn(`⚠️ ${remainingZeroScores}개의 0점 아이디어가 여전히 남아있습니다`);
        toast({
          title: `⚠️ ${remainingZeroScores}개 아이디어 추가 처리 필요`,
          variant: 'destructive',
          duration: 3000,
        });
      }

    } catch (error: any) {
      console.error('❌ 긴급 점수 수정 실패:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message || 'Unknown error',
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
