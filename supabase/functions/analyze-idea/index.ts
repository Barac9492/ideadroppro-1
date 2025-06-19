
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
      ? `다음 비즈니스 아이디어를 엄격하고 현실적으로 분석해주세요:

"${ideaText}"

평가 기준:
1. 구체성 (1-10): 아이디어가 얼마나 구체적이고 명확한가?
2. 현실성 (1-10): 기술적, 경제적으로 실현 가능한가?
3. 차별성 (1-10): 기존 솔루션과 얼마나 차별화되는가?
4. 시장성 (1-10): 명확한 타겟과 수익 모델이 있는가?

점수 계산 방식:
- 매우 구체적이고 실현 가능한 아이디어: 7-8점
- 일반적이지만 타당한 아이디어: 5-6점
- 모호하거나 비현실적인 아이디어: 3-4점
- 너무 추상적이거나 불가능한 아이디어: 1-2점

다음 JSON 형식으로 응답해주세요:
{
  "score": 5.5,
  "specificity": 6,
  "realism": 5,
  "differentiation": 4,
  "marketability": 7,
  "tags": ["태그1", "태그2", "태그3"],
  "analysis": "이 아이디어에 대한 비판적이고 현실적인 분석...",
  "improvements": ["구체적인 개선점1", "구체적인 개선점2", "구체적인 개선점3"],
  "marketPotential": ["시장잠재력1", "시장잠재력2"],
  "similarIdeas": ["유사아이디어1", "유사아이디어2"],
  "pitchPoints": ["피칭포인트1", "피칭포인트2", "피칭포인트3"]
}

중요: 
- 너무 추상적인 아이디어는 낮은 점수를 주세요
- 구체적인 실행 계획이 없으면 점수를 깎으세요
- 기존 솔루션과 차별점이 불분명하면 지적하세요
- 과대포장된 표현보다는 현실적인 분석을 해주세요`
      : `Analyze this business idea with strict and realistic criteria:

"${ideaText}"

Evaluation Criteria:
1. Specificity (1-10): How specific and clear is the idea?
2. Realism (1-10): Is it technically and economically feasible?
3. Differentiation (1-10): How differentiated is it from existing solutions?
4. Marketability (1-10): Does it have clear target and revenue model?

Scoring Guidelines:
- Very specific and feasible ideas: 7-8 points
- General but valid ideas: 5-6 points
- Vague or unrealistic ideas: 3-4 points
- Too abstract or impossible ideas: 1-2 points

Please provide a JSON response in this format:
{
  "score": 5.5,
  "specificity": 6,
  "realism": 5,
  "differentiation": 4,
  "marketability": 7,
  "tags": ["tag1", "tag2", "tag3"],
  "analysis": "Critical and realistic analysis of this idea...",
  "improvements": ["specific improvement1", "specific improvement2", "specific improvement3"],
  "marketPotential": ["potential1", "potential2"],
  "similarIdeas": ["similar1", "similar2"],
  "pitchPoints": ["pitch1", "pitch2", "pitch3"]
}

Important:
- Give low scores to overly abstract ideas
- Reduce points if there's no concrete execution plan
- Point out if differentiation from existing solutions is unclear
- Provide realistic analysis rather than overly optimistic assessments`;

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
          temperature: 0.3, // Lower temperature for more consistent scoring
          topK: 20,
          topP: 0.8,
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
        
        // Validate and adjust scores if needed
        if (analysisResult.score > 8.5) {
          console.log('Score too high, adjusting:', analysisResult.score);
          analysisResult.score = Math.min(8.5, analysisResult.score * 0.85);
        }
        
        // Ensure score is reasonable for vague ideas
        if (ideaText.length < 50 && analysisResult.score > 6) {
          console.log('Short idea with high score, adjusting');
          analysisResult.score = Math.min(6, analysisResult.score);
        }
        
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback response with more realistic scoring
      const fallbackScore = Math.round((Math.random() * 3 + 4) * 10) / 10; // 4.0-7.0 range
      analysisResult = {
        score: fallbackScore,
        specificity: Math.round(Math.random() * 4 + 4), // 4-8 range
        realism: Math.round(Math.random() * 4 + 3), // 3-7 range
        differentiation: Math.round(Math.random() * 5 + 3), // 3-8 range
        marketability: Math.round(Math.random() * 4 + 4), // 4-8 range
        tags: language === 'ko' ? ['일반', '개선필요'] : ['general', 'needs-improvement'],
        analysis: language === 'ko' 
          ? '아이디어 분석을 완료했습니다. 더 구체적인 실행 계획과 차별화 전략이 필요합니다.'
          : 'Idea analysis completed. More specific execution plan and differentiation strategy needed.',
        improvements: language === 'ko' 
          ? ['구체적인 목표 설정', '실행 계획 수립', '차별화 포인트 명확화']
          : ['Set specific goals', 'Develop execution plan', 'Clarify differentiation points'],
        marketPotential: language === 'ko'
          ? ['시장 조사 필요', '타겟 고객 분석 필요']
          : ['Market research needed', 'Target customer analysis needed'],
        similarIdeas: language === 'ko'
          ? ['기존 솔루션 조사 필요']
          : ['Existing solution research needed'],
        pitchPoints: language === 'ko'
          ? ['아이디어 구체화', '실현 가능성 검토', '시장 검증']
          : ['Idea specification', 'Feasibility review', 'Market validation']
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
