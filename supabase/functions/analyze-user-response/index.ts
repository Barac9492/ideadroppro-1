
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
    const { 
      originalIdea,
      userAnswer,
      moduleType,
      conversationHistory,
      language = 'ko' 
    } = await req.json();

    console.log('Analyzing user response:', { moduleType, answerLength: userAnswer?.length });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      // Return basic analysis without AI
      return new Response(
        JSON.stringify({
          completeness: Math.min(100, userAnswer.length * 2),
          suggestions: language === 'ko' ? [
            '답변이 잘 작성되었습니다',
            '더 구체적인 예시를 추가해보세요'
          ] : [
            'Your answer is well written',
            'Consider adding more specific examples'
          ],
          insights: language === 'ko' ? '좋은 접근입니다!' : 'Good approach!'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = language === 'ko' ? `
사용자의 답변을 분석하고 건설적인 피드백을 제공해주세요.

**원본 아이디어:** ${originalIdea}
**모듈 타입:** ${moduleType}
**사용자 답변:** ${userAnswer}

다음 기준으로 분석해주세요:
1. 완성도 (0-100점)
2. 구체성과 실현 가능성
3. 개선 제안사항 2-3개
4. 긍정적인 인사이트

JSON 형식으로 응답:
{
  "completeness": 숫자,
  "suggestions": ["개선사항1", "개선사항2"],
  "insights": "긍정적 피드백"
}
` : `
Analyze the user's answer and provide constructive feedback.

**Original idea:** ${originalIdea}  
**Module type:** ${moduleType}
**User answer:** ${userAnswer}

Analyze based on:
1. Completeness (0-100 points)
2. Specificity and feasibility  
3. 2-3 improvement suggestions
4. Positive insights

Respond in JSON format:
{
  "completeness": number,
  "suggestions": ["improvement1", "improvement2"],
  "insights": "positive feedback"
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst. Provide constructive feedback in valid JSON format only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      // Fallback analysis
      analysis = {
        completeness: Math.min(100, Math.max(50, userAnswer.length * 1.5)),
        suggestions: language === 'ko' ? [
          '더 구체적인 예시나 데이터를 추가해보세요',
          '실제 구현 방안을 고려해보세요'
        ] : [
          'Consider adding more specific examples or data',
          'Think about actual implementation methods'
        ],
        insights: language === 'ko' ? '창의적인 접근이 돋보입니다!' : 'Your creative approach stands out!'
      };
    }

    console.log('Analysis result:', analysis);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-user-response function:', error);
    return new Response(
      JSON.stringify({
        completeness: 70,
        suggestions: language === 'ko' ? ['좋은 시작입니다!'] : ['Good start!'],
        insights: language === 'ko' ? '계속 발전시켜보세요' : 'Keep developing it'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
