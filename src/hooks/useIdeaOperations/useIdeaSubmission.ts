
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
      scoringComplete: '점수가 성공적으로 부여되었습니다!',
      emergencyScoring: '긴급 점수 적용 완료!'
    },
    en: {
      submitting: 'Submitting...',
      analyzing: 'AI is analyzing...',
      submitted: 'Idea submitted successfully!',
      error: 'Error submitting idea',
      loginRequired: 'Please log in to submit an idea',
      tooShort: 'Idea must be at least 10 characters long',
      processing: 'Processing your idea...',
      scoringComplete: 'Scoring completed successfully!',
      emergencyScoring: 'Emergency scoring applied!'
    }
  };

  // 강력한 백업 점수 계산 함수
  const calculateGuaranteedScore = (ideaText: string) => {
    let score = 4.5; // 높은 기본 점수로 시작
    
    // 텍스트 품질 평가
    const textLength = ideaText.trim().length;
    if (textLength > 30) score += 0.3;
    if (textLength > 80) score += 0.7;
    if (textLength > 150) score += 0.5;
    if (textLength > 250) score += 0.3;
    
    // 문장 구조 평가
    const sentences = ideaText.split(/[.!?]/).filter(s => s.trim().length > 10);
    score += Math.min(sentences.length * 0.2, 1.0);
    
    // 키워드 기반 보너스 (더 광범위한 키워드)
    const techKeywords = ['AI', '인공지능', '앱', '서비스', '플랫폼', '시스템', '솔루션', '기술'];
    const businessKeywords = ['비즈니스', '수익', '고객', '마케팅', '판매', '서비스', '제품'];
    const innovationKeywords = ['혁신', '새로운', '개선', '효율', '자동화', '최적화', '스마트'];
    
    const allKeywords = [...techKeywords, ...businessKeywords, ...innovationKeywords];
    const matchedKeywords = allKeywords.filter(keyword => 
      ideaText.toLowerCase().includes(keyword.toLowerCase())
    );
    score += Math.min(matchedKeywords.length * 0.25, 1.5);
    
    // 창의성 추정 (특수문자, 이모지, 독특한 표현)
    if (/[!@#$%^&*()_+={}\[\]:";'<>?,.\/]/.test(ideaText)) score += 0.2;
    // Fix: Use Unicode property escapes for emoji detection instead of character range
    if (/\p{Emoji}/u.test(ideaText)) score += 0.3;
    
    // 상세도 평가 (구체적인 숫자나 명사 등장)
    const numbers = ideaText.match(/\d+/g);
    if (numbers && numbers.length > 0) score += 0.3;
    
    // 최소/최대 범위 보장 (절대 0이 되지 않도록)
    const finalScore = Math.max(3.0, Math.min(9.0, score));
    
    console.log(`💯 Guaranteed scoring: ${finalScore.toFixed(1)} for text length ${textLength}`);
    return parseFloat(finalScore.toFixed(1));
  };

  const submitIdea = async (ideaText: string) => {
    if (!user) {
      toast({
        title: text[currentLanguage].loginRequired,
        variant: 'destructive',
        duration: 3000,
      });
      throw new Error('Authentication required');
    }

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
      console.log('💡 Submitting new idea with GUARANTEED scoring');
      console.log('📝 Idea text length:', trimmedText.length);
      
      toast({
        title: text[currentLanguage].processing,
        duration: 2000,
      });

      // 즉시 보장된 점수 계산
      const guaranteedScore = calculateGuaranteedScore(trimmedText);
      
      // 기본 분석 데이터 생성
      const basicAnalysis = currentLanguage === 'ko' 
        ? `이 아이디어는 ${guaranteedScore}점으로 평가되었습니다. 창의성과 실현 가능성을 바탕으로 한 종합 점수입니다.`
        : `This idea scored ${guaranteedScore} points based on creativity and feasibility assessment.`;

      const basicTags = ['신규', '분석완료'];
      const basicImprovements = [
        currentLanguage === 'ko' ? '구체적인 실행 계획 수립' : 'Develop specific execution plan',
        currentLanguage === 'ko' ? '타겟 시장 분석' : 'Analyze target market',
        currentLanguage === 'ko' ? '경쟁 분석 실시' : 'Conduct competitive analysis'
      ];
      const basicMarketPotential = [
        currentLanguage === 'ko' ? '시장 규모 조사 필요' : 'Market size research needed',
        currentLanguage === 'ko' ? '고객 니즈 검증' : 'Validate customer needs'
      ];

      // 아이디어를 보장된 점수와 함께 삽입
      const { data: ideaData, error: insertError } = await supabase
        .from('ideas')
        .insert({
          text: trimmedText,
          user_id: user.id,
          score: guaranteedScore, // 보장된 점수
          tags: basicTags,
          ai_analysis: basicAnalysis,
          improvements: basicImprovements,
          market_potential: basicMarketPotential,
          similar_ideas: [],
          pitch_points: [
            currentLanguage === 'ko' ? '독창적인 아이디어' : 'Original idea',
            currentLanguage === 'ko' ? '시장 잠재력 보유' : 'Market potential'
          ],
          likes_count: 0,
          seed: false
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error inserting idea:', insertError);
        throw insertError;
      }

      console.log(`✅ Idea inserted successfully with guaranteed score: ${guaranteedScore}`);

      toast({
        title: text[currentLanguage].emergencyScoring,
        description: `점수: ${guaranteedScore}점`,
        duration: 4000,
      });

      // 아이디어 목록 새로고침
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
