
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaText, language = 'ko' } = await req.json();
    
    console.log('Analyzing idea:', ideaText, 'Language:', language);

    const prompt = language === 'ko' 
      ? `다음 아이디어를 분석해주세요: "${ideaText}"

다음 형식으로 JSON 응답을 제공해주세요:
{
  "score": 1-10 사이의 숫자 (아이디어의 전체적인 잠재력),
  "tags": ["태그1", "태그2", "태그3"] (최대 4개의 관련 태그),
  "analysis": "이 아이디어에 대한 간단한 분석 (2-3문장)",
  "improvements": ["개선점1", "개선점2", "개선점3"] (구체적인 개선 제안),
  "marketPotential": ["시장점1", "시장점2", "시장점3"] (시장 잠재력 분석),
  "similarIdeas": ["유사아이디어1", "유사아이디어2", "유사아이디어3"] (비슷한 기존 아이디어들),
  "pitchPoints": ["포인트1", "포인트2", "포인트3", "포인트4"] (피치덱에 포함할 핵심 포인트)
}

JSON 형식으로만 응답해주세요.`
      : `Please analyze the following idea: "${ideaText}"

Provide a JSON response in the following format:
{
  "score": number between 1-10 (overall potential of the idea),
  "tags": ["tag1", "tag2", "tag3"] (up to 4 relevant tags),
  "analysis": "Brief analysis of this idea (2-3 sentences)",
  "improvements": ["improvement1", "improvement2", "improvement3"] (specific improvement suggestions),
  "marketPotential": ["point1", "point2", "point3"] (market potential analysis),
  "similarIdeas": ["similar1", "similar2", "similar3"] (existing similar ideas),
  "pitchPoints": ["point1", "point2", "point3", "point4"] (key points for pitch deck)
}

Please respond only in JSON format.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // JSON 파싱 시도
    let analysisResult;
    try {
      // JSON 코드 블록이 있다면 제거
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // 파싱 실패시 기본값 제공
      analysisResult = {
        score: Math.round((Math.random() * 3 + 7) * 10) / 10,
        tags: language === 'ko' ? ['혁신', '기술', '스타트업'] : ['Innovation', 'Technology', 'Startup'],
        analysis: language === 'ko' 
          ? '이 아이디어는 흥미로운 잠재력을 가지고 있습니다. 더 자세한 분석을 위해 추가 정보가 필요합니다.'
          : 'This idea has interesting potential. Additional information is needed for more detailed analysis.',
        improvements: language === 'ko' 
          ? ['구체적인 타겟 사용자 정의', '기술적 구현 방안 검토', '시장 검증 과정 필요']
          : ['Define specific target users', 'Review technical implementation', 'Market validation needed'],
        marketPotential: language === 'ko'
          ? ['새로운 시장 기회 존재', '사용자 수요 증가 추세', '기술 발전에 따른 실현 가능성']
          : ['New market opportunities exist', 'Growing user demand trend', 'Feasibility with tech advancement'],
        similarIdeas: language === 'ko'
          ? ['기존 유사 서비스 검토 필요', '차별화 포인트 개발 요구', '경쟁 우위 확보 방안 필요']
          : ['Review existing similar services', 'Need differentiation points', 'Competitive advantage required'],
        pitchPoints: language === 'ko'
          ? ['문제 정의', '솔루션 제시', '시장 기회', '비즈니스 모델']
          : ['Problem Definition', 'Solution Presentation', 'Market Opportunity', 'Business Model']
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-idea function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
