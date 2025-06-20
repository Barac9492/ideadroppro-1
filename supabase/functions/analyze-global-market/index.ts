
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaText, language } = await req.json();
    console.log('Analyzing global market for idea:', ideaText, 'Language:', language);

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const prompt = language === 'ko' 
      ? `다음 비즈니스 아이디어를 글로벌 시장 관점에서 분석해주세요:

"${ideaText}"

주요 분석 영역:
1. 시장별 수용성 (미국, 유럽, 아시아)
2. 문화적 적합성 및 현지화 필요성
3. 글로벌 경쟁 환경 및 진입 장벽
4. 우선 진출 시장 추천
5. 현지화 전략 및 고려사항

다음 JSON 형식으로 응답해주세요 (아시아도 다른 지역과 동일한 구조로):
{
  "marketAcceptance": {
    "northAmerica": {
      "score": 7,
      "reasons": ["높은 기술 수용성", "큰 시장 규모"],
      "challenges": ["높은 경쟁", "규제 복잡성"]
    },
    "europe": {
      "score": 6,
      "reasons": ["강한 개인정보 보호 의식"],
      "challenges": ["GDPR 규제", "다양한 언어"]
    },
    "asia": {
      "score": 8,
      "reasons": ["빠른 디지털 채택", "모바일 중심", "성장 시장"],
      "challenges": ["문화적 다양성", "현지 플레이어", "규제 차이"]
    }
  },
  "culturalFit": {
    "adaptationNeeded": ["언어 현지화", "결제 시스템", "UI/UX 조정"],
    "culturalBarriers": ["신뢰 구축", "브랜드 인식"],
    "opportunities": ["문화적 장점 활용 방안"]
  },
  "competitiveAnalysis": {
    "globalCompetitors": ["경쟁사1", "경쟁사2"],
    "entryBarriers": ["높은 마케팅 비용", "규제 장벽"],
    "advantages": ["차별화 포인트", "한국 출신 강점"]
  },
  "recommendedMarkets": [
    {
      "market": "동남아시아",
      "priority": 1,
      "reasons": ["한류 인기", "모바일 중심", "성장 시장"]
    }
  ],
  "localizationStrategy": {
    "technical": ["언어 지원", "현지 결제"],
    "business": ["파트너십", "현지 채용"],
    "marketing": ["현지 인플루언서", "문화적 마케팅"]
  },
  "summary": "이 아이디어의 글로벌 진출 가능성에 대한 종합 평가..."
}`
      : `Analyze this business idea from a global market perspective:

"${ideaText}"

Key Analysis Areas:
1. Market acceptance by region (North America, Europe, Asia)
2. Cultural fit and localization needs
3. Global competitive landscape and entry barriers
4. Recommended priority markets
5. Localization strategy and considerations

Please provide a JSON response in this format (Asia should have the same structure as other regions):
{
  "marketAcceptance": {
    "northAmerica": {
      "score": 7,
      "reasons": ["High tech adoption", "Large market size"],
      "challenges": ["Intense competition", "Regulatory complexity"]
    },
    "europe": {
      "score": 6,
      "reasons": ["Strong privacy consciousness"],
      "challenges": ["GDPR regulations", "Language diversity"]
    },
    "asia": {
      "score": 8,
      "reasons": ["Fast digital adoption", "Mobile-first", "Growing markets"],
      "challenges": ["Cultural diversity", "Local players", "Regulatory differences"]
    }
  },
  "culturalFit": {
    "adaptationNeeded": ["Language localization", "Payment systems", "UI/UX adjustments"],
    "culturalBarriers": ["Trust building", "Brand recognition"],
    "opportunities": ["Ways to leverage cultural advantages"]
  },
  "competitiveAnalysis": {
    "globalCompetitors": ["Competitor1", "Competitor2"],
    "entryBarriers": ["High marketing costs", "Regulatory barriers"],
    "advantages": ["Differentiation points", "Korean origin advantages"]
  },
  "recommendedMarkets": [
    {
      "market": "Southeast Asia",
      "priority": 1,
      "reasons": ["K-culture popularity", "Mobile-centric", "Growing market"]
    }
  ],
  "localizationStrategy": {
    "technical": ["Language support", "Local payments"],
    "business": ["Partnerships", "Local hiring"],
    "marketing": ["Local influencers", "Cultural marketing"]
  },
  "summary": "Comprehensive assessment of this idea's global expansion potential..."
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.4,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 3000,
        }
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    let globalAnalysisResult;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        globalAnalysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback response with consistent structure
      globalAnalysisResult = {
        marketAcceptance: {
          northAmerica: { 
            score: 6, 
            reasons: [language === 'ko' ? '분석 필요' : 'Analysis needed'], 
            challenges: [language === 'ko' ? '시장 조사 필요' : 'Market research needed'] 
          },
          europe: { 
            score: 5, 
            reasons: [language === 'ko' ? '분석 필요' : 'Analysis needed'], 
            challenges: [language === 'ko' ? '시장 조사 필요' : 'Market research needed'] 
          },
          asia: { 
            score: 7, 
            reasons: [language === 'ko' ? '아시아 시장 친화적' : 'Asia-friendly market'], 
            challenges: [language === 'ko' ? '현지화 필요' : 'Localization needed'] 
          }
        },
        culturalFit: {
          adaptationNeeded: [language === 'ko' ? '현지화 전략 수립' : 'Localization strategy needed'],
          culturalBarriers: [language === 'ko' ? '문화적 장벽 분석 필요' : 'Cultural barrier analysis needed'],
          opportunities: [language === 'ko' ? '기회 요소 발굴 필요' : 'Opportunity identification needed']
        },
        competitiveAnalysis: {
          globalCompetitors: [language === 'ko' ? '경쟁사 분석 필요' : 'Competitor analysis needed'],
          entryBarriers: [language === 'ko' ? '진입 장벽 분석' : 'Entry barrier analysis'],
          advantages: [language === 'ko' ? '차별화 포인트 발굴' : 'Differentiation point identification']
        },
        recommendedMarkets: [{
          market: language === 'ko' ? '아시아 태평양' : 'Asia Pacific',
          priority: 1,
          reasons: [language === 'ko' ? '성장 시장' : 'Growing market']
        }],
        localizationStrategy: {
          technical: [language === 'ko' ? '기술적 현지화' : 'Technical localization'],
          business: [language === 'ko' ? '비즈니스 전략' : 'Business strategy'],
          marketing: [language === 'ko' ? '마케팅 현지화' : 'Marketing localization']
        },
        summary: language === 'ko' ? 
          '글로벌 시장 분석이 부분적으로 완료되었습니다. 더 자세한 분석을 위해 시장 조사가 필요합니다.' :
          'Global market analysis partially completed. Further market research needed for detailed analysis.'
      };
    }

    return new Response(JSON.stringify(globalAnalysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-global-market function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
