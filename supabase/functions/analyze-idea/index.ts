
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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found');
    }

    const prompt = language === 'ko' 
      ? `당신은 경험이 풍부한 벤처 캐피털리스트입니다. 다음 비즈니스 아이디어를 VC 관점에서 분석해주세요:

"${ideaText}"

다음 형식으로 구체적이고 실용적인 분석을 제공해주세요:

**개선 사항 (3-5개):**
- 구체적이고 실행 가능한 개선 방안
- 기술적/비즈니스적 관점에서의 제안

**시장 잠재력 (3-4개):**
- 타겟 시장 규모와 성장성
- 수익화 가능성과 확장성
- 경쟁사 대비 차별화 포인트

**유사 아이디어/경쟁사 (2-3개):**
- 기존 시장의 유사 서비스나 제품
- 차별화 전략 필요성

**투자 피치 포인트 (3-4개):**
- 투자자에게 어필할 수 있는 핵심 강점
- 시장 기회와 성장 잠재력
- 팀의 실행 역량과 비전

각 항목은 구체적이고 실행 가능한 내용으로 작성하되, VC가 실제로 검토할 때 고려하는 요소들을 포함해주세요.`
      : `You are an experienced venture capitalist. Please analyze the following business idea from a VC perspective:

"${ideaText}"

Provide a specific and practical analysis in the following format:

**Improvements (3-5 items):**
- Specific and actionable improvement suggestions
- Technical/business perspective recommendations

**Market Potential (3-4 items):**
- Target market size and growth potential
- Monetization possibilities and scalability
- Differentiation points vs competitors

**Similar Ideas/Competitors (2-3 items):**
- Existing similar services or products in the market
- Need for differentiation strategy

**Investment Pitch Points (3-4 items):**
- Key strengths that would appeal to investors
- Market opportunities and growth potential
- Team execution capability and vision

Each item should be specific and actionable, including factors that VCs actually consider during their review process.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Parse the analysis into structured format
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

    // Enhanced scoring algorithm with broader range
    const calculateScore = () => {
      let score = 3.0; // Lower base score
      
      // Text quality assessment
      const ideaLength = ideaText.trim().length;
      if (ideaLength > 100) score += 1.0;
      if (ideaLength > 200) score += 0.5;
      
      // Innovation indicators
      const innovationKeywords = language === 'ko' 
        ? ['AI', '블록체인', '머신러닝', '자동화', '혁신', 'IoT', '빅데이터', 'VR', 'AR']
        : ['AI', 'blockchain', 'machine learning', 'automation', 'innovation', 'IoT', 'big data', 'VR', 'AR'];
      
      const hasInnovation = innovationKeywords.some(keyword => 
        ideaText.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasInnovation) score += 1.0;
      
      // Market potential based on analysis quality
      if (marketPotential.length >= 3) score += 1.0;
      if (marketPotential.some(p => 
        p.toLowerCase().includes(language === 'ko' ? '확장' : 'scalab') ||
        p.toLowerCase().includes(language === 'ko' ? '시장' : 'market')
      )) score += 0.5;
      
      // Competition analysis
      if (similarIdeas.length <= 2) score += 0.5; // Less competition
      if (similarIdeas.length >= 3) score -= 0.5; // More competition
      
      // Implementation feasibility
      if (improvements.length >= 4) score += 0.5;
      if (improvements.some(imp => 
        imp.toLowerCase().includes(language === 'ko' ? '단순' : 'simple') ||
        imp.toLowerCase().includes(language === 'ko' ? '쉬운' : 'easy')
      )) score += 0.5;
      
      // Pitch strength
      if (pitchPoints.length >= 3) score += 1.0;
      
      // Analysis depth bonus
      const totalAnalysisItems = improvements.length + marketPotential.length + similarIdeas.length + pitchPoints.length;
      if (totalAnalysisItems >= 12) score += 0.5;
      
      // Random variation for realism (±0.3)
      const randomVariation = (Math.random() - 0.5) * 0.6;
      score += randomVariation;
      
      // Ensure score is within valid range
      return Math.max(1.0, Math.min(10.0, parseFloat(score.toFixed(1))));
    };

    const score = calculateScore();

    console.log('Analysis completed successfully with score:', score);

    return new Response(
      JSON.stringify({
        score,
        analysis: analysisText,
        improvements,
        marketPotential,
        similarIdeas,
        pitchPoints
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
