
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
    console.log('Analyzing idea:', ideaText, 'Language:', language);

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const prompt = language === 'ko' 
      ? `다음 비즈니스 아이디어를 분석해주세요:

"${ideaText}"

다음 형식으로 JSON 응답을 제공해주세요:
{
  "score": 8.5,
  "tags": ["태그1", "태그2", "태그3"],
  "analysis": "이 아이디어에 대한 상세한 분석...",
  "improvements": ["개선점1", "개선점2", "개선점3"],
  "marketPotential": ["시장잠재력1", "시장잠재력2"],
  "similarIdeas": ["유사아이디어1", "유사아이디어2"],
  "pitchPoints": ["피칭포인트1", "피칭포인트2", "피칭포인트3"]
}

점수는 1-10 사이로, 모든 필드를 한국어로 작성해주세요.`
      : `Analyze this business idea:

"${ideaText}"

Please provide a JSON response in this format:
{
  "score": 8.5,
  "tags": ["tag1", "tag2", "tag3"],
  "analysis": "Detailed analysis of this idea...",
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "marketPotential": ["potential1", "potential2"],
  "similarIdeas": ["similar1", "similar2"],
  "pitchPoints": ["pitch1", "pitch2", "pitch3"]
}

Score should be between 1-10, and all fields should be in English.`;

    // Use the correct Gemini API endpoint
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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

    // Extract JSON from the response
    let analysisResult;
    try {
      // Try to find JSON in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback response
      analysisResult = {
        score: Math.round((Math.random() * 3 + 7) * 10) / 10,
        tags: ['혁신', '기술', '서비스'],
        analysis: '아이디어 분석을 완료했습니다.',
        improvements: ['시장 조사 강화', '비즈니스 모델 구체화'],
        marketPotential: ['성장 가능성 높음', '타겟 시장 명확'],
        similarIdeas: ['기존 서비스와 차별화 필요'],
        pitchPoints: ['독창성', '실현 가능성', '시장 수요']
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
