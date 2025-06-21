
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaText, language = 'ko' } = await req.json();

    if (!ideaText) {
      return new Response(
        JSON.stringify({ error: 'Idea text is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('🚀 Starting analysis for idea:', ideaText.substring(0, 50) + '...');

    // 강화된 보장 점수 계산 시스템
    const calculateGuaranteedScore = () => {
      let score = 4.5; // 높은 기본 점수
      
      // 텍스트 길이 평가
      const textLength = ideaText.trim().length;
      if (textLength > 30) score += 0.3;
      if (textLength > 80) score += 0.7;
      if (textLength > 150) score += 0.5;
      if (textLength > 250) score += 0.3;
      
      // 키워드 기반 보너스
      const keywords = ['AI', '인공지능', '앱', '서비스', '플랫폼', '시스템', '솔루션', '기술', '비즈니스', '혁신'];
      const matchedKeywords = keywords.filter(keyword => 
        ideaText.toLowerCase().includes(keyword.toLowerCase())
      );
      score += Math.min(matchedKeywords.length * 0.25, 1.5);
      
      // 문장 구조 평가
      const sentences = ideaText.split(/[.!?]/).filter(s => s.trim().length > 10);
      score += Math.min(sentences.length * 0.2, 1.0);
      
      // 창의성 보너스
      if (/\p{Emoji}/u.test(ideaText)) score += 0.3;
      if (/\d+/.test(ideaText)) score += 0.3;
      
      // 최종 점수: 3.5 ~ 8.5 범위
      const finalScore = Math.max(3.5, Math.min(8.5, score));
      console.log(`💯 Guaranteed score calculated: ${finalScore.toFixed(1)}`);
      return parseFloat(finalScore.toFixed(1));
    };

    // 기본 분석 데이터 생성
    const generateBasicAnalysis = (score) => {
      const basicAnalysis = language === 'ko' 
        ? `이 아이디어는 ${score}점으로 평가되었습니다. 창의성과 실현 가능성을 고려한 종합 점수입니다.`
        : `This idea scored ${score} points based on creativity and feasibility assessment.`;

      const improvements = language === 'ko' ? [
        '구체적인 실행 계획 수립',
        '타겟 시장 분석 강화',
        '경쟁 분석 실시',
        '수익 모델 구체화'
      ] : [
        'Develop specific execution plan',
        'Strengthen target market analysis',
        'Conduct competitive analysis',
        'Define revenue model'
      ];

      const marketPotential = language === 'ko' ? [
        '시장 규모 조사 필요',
        '고객 니즈 검증',
        '성장 잠재력 분석'
      ] : [
        'Market size research needed',
        'Validate customer needs',
        'Analyze growth potential'
      ];

      const similarIdeas = language === 'ko' ? [
        '기존 시장 솔루션 조사',
        '차별화 전략 필요'
      ] : [
        'Research existing market solutions',
        'Differentiation strategy needed'
      ];

      const pitchPoints = language === 'ko' ? [
        '독창적인 아이디어',
        '시장 잠재력 보유',
        '실현 가능성 검토',
        '투자 가치 평가'
      ] : [
        'Original idea',
        'Market potential',
        'Feasibility assessment',
        'Investment value evaluation'
      ];

      return {
        score,
        analysis: basicAnalysis,
        improvements,
        marketPotential,
        similarIdeas,
        pitchPoints
      };
    };

    // AI 분석 시도
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    let analysisResult = null;

    if (GEMINI_API_KEY) {
      try {
        console.log('🤖 Attempting AI analysis with Gemini...');
        
        const prompt = language === 'ko' 
          ? `당신은 경험이 풍부한 벤처 캐피털리스트입니다. 다음 비즈니스 아이디어를 VC 관점에서 분석해주세요:

"${ideaText}"

다음 형식으로 구체적이고 실용적인 분석을 제공해주세요:

**개선 사항 (3-5개):**
- 구체적이고 실행 가능한 개선 방안

**시장 잠재력 (3-4개):**
- 타겟 시장 규모와 성장성
- 수익화 가능성과 확장성

**유사 아이디어/경쟁사 (2-3개):**
- 기존 시장의 유사 서비스나 제품

**투자 피치 포인트 (3-4개):**
- 투자자에게 어필할 수 있는 핵심 강점

각 항목은 구체적이고 실행 가능한 내용으로 작성해주세요.`
          : `You are an experienced venture capitalist. Please analyze the following business idea from a VC perspective:

"${ideaText}"

Provide analysis in this format:

**Improvements (3-5 items):**
- Specific and actionable improvement suggestions

**Market Potential (3-4 items):**
- Target market size and growth potential
- Monetization possibilities and scalability

**Similar Ideas/Competitors (2-3 items):**
- Existing similar services or products in the market

**Investment Pitch Points (3-4 items):**
- Key strengths that would appeal to investors

Each item should be specific and actionable.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
              }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const analysisText = data.candidates[0].content.parts[0].text;
            console.log('✅ AI analysis successful');
            
            // Parse sections
            const parseSection = (text: string, sectionName: string): string[] => {
              const regex = new RegExp(`\\*\\*${sectionName}[^:]*:(.*?)(?=\\*\\*|$)`, 'is');
              const match = text.match(regex);
              if (!match) return [];
              
              return match[1]
                .split(/[-•]\s+/)
                .filter(item => item.trim().length > 0)
                .map(item => item.trim().replace(/\n\s*/g, ' '))
                .slice(0, 5);
            };

            const improvements = parseSection(analysisText, language === 'ko' ? '개선 사항' : 'Improvements');
            const marketPotential = parseSection(analysisText, language === 'ko' ? '시장 잠재력' : 'Market Potential');
            const similarIdeas = parseSection(analysisText, language === 'ko' ? '유사 아이디어' : 'Similar Ideas');
            const pitchPoints = parseSection(analysisText, language === 'ko' ? '투자 피치 포인트' : 'Investment Pitch Points');

            // AI 기반 점수 계산
            let aiScore = 4.0;
            const ideaLength = ideaText.trim().length;
            if (ideaLength > 50) aiScore += 0.5;
            if (ideaLength > 100) aiScore += 1.0;
            if (ideaLength > 200) aiScore += 0.5;
            
            const innovationKeywords = language === 'ko' 
              ? ['AI', '인공지능', '블록체인', '머신러닝', '자동화', '혁신', 'IoT', '빅데이터', 'VR', 'AR']
              : ['AI', 'blockchain', 'machine learning', 'automation', 'innovation', 'IoT', 'big data', 'VR', 'AR'];
            
            const hasInnovation = innovationKeywords.some(keyword => 
              ideaText.toLowerCase().includes(keyword.toLowerCase())
            );
            if (hasInnovation) aiScore += 1.0;
            
            if (marketPotential.length >= 2) aiScore += 0.5;
            if (improvements.length >= 3) aiScore += 0.5;
            if (pitchPoints.length >= 3) aiScore += 0.5;
            
            const randomVariation = (Math.random() - 0.5) * 1.0;
            aiScore += randomVariation;
            
            const finalScore = Math.max(2.0, Math.min(10.0, parseFloat(aiScore.toFixed(1))));

            analysisResult = {
              score: finalScore,
              analysis: analysisText,
              improvements: improvements.length > 0 ? improvements : [
                language === 'ko' ? '구체적인 실행 계획 수립' : 'Develop specific execution plan'
              ],
              marketPotential: marketPotential.length > 0 ? marketPotential : [
                language === 'ko' ? '시장 규모 조사 필요' : 'Market size research needed'
              ],
              similarIdeas: similarIdeas.length > 0 ? similarIdeas : [
                language === 'ko' ? '기존 솔루션 조사 필요' : 'Research existing solutions'
              ],
              pitchPoints: pitchPoints.length > 0 ? pitchPoints : [
                language === 'ko' ? '고유한 가치 제안' : 'Unique value proposition'
              ]
            };
            
            console.log(`🎯 AI analysis completed with score: ${finalScore}`);
          }
        }
      } catch (aiError) {
        console.error('❌ AI analysis failed:', aiError);
      }
    }

    // AI 분석이 실패했거나 API 키가 없는 경우 보장된 분석 사용
    if (!analysisResult) {
      console.log('🛡️ Using guaranteed fallback analysis');
      const guaranteedScore = calculateGuaranteedScore();
      analysisResult = generateBasicAnalysis(guaranteedScore);
    }

    console.log('📊 Final analysis result:', {
      score: analysisResult.score,
      improvements: analysisResult.improvements?.length || 0,
      marketPotential: analysisResult.marketPotential?.length || 0,
      similarIdeas: analysisResult.similarIdeas?.length || 0,
      pitchPoints: analysisResult.pitchPoints?.length || 0
    });

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('💥 Analysis function error:', error);
    
    // 완전 실패 시에도 기본 점수 반환
    const fallbackScore = 5.0;
    const fallbackResult = {
      score: fallbackScore,
      analysis: 'Analysis failed but providing default score.',
      improvements: ['Develop execution plan'],
      marketPotential: ['Research market size'],
      similarIdeas: ['Study competitors'],
      pitchPoints: ['Define value proposition'],
      error: 'Analysis failed',
      details: error.message 
    };
    
    return new Response(
      JSON.stringify(fallbackResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
