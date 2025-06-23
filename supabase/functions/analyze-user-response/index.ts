
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
      // Return enhanced basic analysis without AI
      const completeness = Math.min(100, Math.max(30, userAnswer.length * 2));
      return new Response(
        JSON.stringify({
          completeness: completeness,
          suggestions: language === 'ko' ? [
            '더 구체적인 예시나 데이터를 추가해보세요',
            '실제 사용자의 입장에서 생각해보세요',
            '경쟁사나 기존 솔루션과의 차별점을 명확히 해보세요'
          ] : [
            'Consider adding more specific examples or data',
            'Think from the actual user\'s perspective',
            'Clarify differentiation from competitors or existing solutions'
          ],
          insights: language === 'ko' ? '좋은 접근입니다! 더 구체화해보세요.' : 'Good approach! Let\'s make it more specific.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = language === 'ko' ? `
사용자의 답변을 분석하고 맥락적이고 개인화된 피드백을 제공해주세요.

**원본 아이디어:** ${originalIdea}
**현재 모듈:** ${moduleType}
**사용자 답변:** ${userAnswer}

다음을 분석해주세요:
1. 답변의 완성도 (0-100점)
2. 구체성과 실현 가능성
3. 개선 제안사항 2-3개 (구체적이고 실행 가능한)
4. 답변에 대한 긍정적이고 개인화된 인사이트

답변 내용을 바탕으로 구체적이고 맥락적인 피드백을 제공해주세요.
기계적인 격려가 아닌, 실제 답변 내용을 반영한 의미 있는 피드백을 해주세요.

JSON 형식으로 응답:
{
  "completeness": 숫자,
  "suggestions": ["구체적인 개선사항1", "구체적인 개선사항2"],
  "insights": "답변 내용을 반영한 개인화된 긍정적 피드백"
}
` : `
Analyze the user's answer and provide contextual, personalized feedback.

**Original idea:** ${originalIdea}  
**Current module:** ${moduleType}
**User answer:** ${userAnswer}

Analyze the following:
1. Answer completeness (0-100 points)
2. Specificity and feasibility  
3. 2-3 improvement suggestions (specific and actionable)
4. Positive, personalized insights about the answer

Provide specific and contextual feedback based on the answer content.
Give meaningful feedback that reflects the actual answer, not mechanical encouragement.

Respond in JSON format:
{
  "completeness": number,
  "suggestions": ["specific improvement1", "specific improvement2"],
  "insights": "personalized positive feedback reflecting the answer content"
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
            content: 'You are a business analyst. Provide specific, contextual feedback based on the user\'s actual answer. Respond with valid JSON format only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 400,
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
      // Enhanced fallback analysis
      const completeness = Math.min(100, Math.max(40, userAnswer.length * 1.8));
      analysis = {
        completeness: completeness,
        suggestions: language === 'ko' ? [
          '더 구체적인 예시나 수치를 포함해보세요',
          '실제 사용자의 관점에서 검증해보세요',
          '실현 가능한 구체적 방안을 추가해보세요'
        ] : [
          'Include more specific examples or metrics',
          'Validate from actual user perspective',
          'Add feasible specific methods'
        ],
        insights: language === 'ko' ? 
          `${moduleType.replace('_', ' ')} 부분에 대한 접근이 인상적입니다!` : 
          `Your approach to ${moduleType.replace('_', ' ')} is impressive!`
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
    
    // Enhanced error fallback
    const fallbackResult = {
      completeness: 60,
      suggestions: language === 'ko' ? [
        '답변을 더 구체화해보세요',
        '실제 사례나 예시를 추가해보세요'
      ] : [
        'Make your answer more specific',
        'Add real cases or examples'
      ],
      insights: language === 'ko' ? '좋은 시작입니다! 계속 발전시켜보세요.' : 'Good start! Keep developing it.'
    };
    
    return new Response(
      JSON.stringify(fallbackResult),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
