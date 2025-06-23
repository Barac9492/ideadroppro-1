
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { ideaText, language = 'ko', context = 'initial' } = await req.json();

    if (!ideaText || ideaText.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: 'Idea text must be at least 5 characters long' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Enhanced question generation:', { ideaLength: ideaText.length, context });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (OPENAI_API_KEY) {
      try {
        const prompt = language === 'ko' ? `
당신은 경험이 풍부한 비즈니스 멘토입니다. 사용자의 아이디어를 구체화하기 위한 5개의 핵심 질문을 생성해주세요.

아이디어: ${ideaText}
컨텍스트: ${context}

각 질문은 다음 비즈니스 모듈과 연관되어야 합니다:
- problem_definition (문제 정의)
- target_customer (타겟 고객)
- value_proposition (가치 제안)
- revenue_model (수익 모델)
- competitive_advantage (경쟁 우위)

질문은 개방형이고 사용자의 창의적 사고를 자극해야 합니다.
추천 답변은 제공하지 마세요. 사용자가 자유롭게 답변할 수 있도록 해주세요.

JSON 형식으로 응답:
{
  "questions": [
    {
      "moduleType": "problem_definition",
      "question": "구체적이고 생각을 자극하는 질문"
    }
  ]
}
` : `
You are an experienced business mentor. Generate 5 key questions to help refine the user's idea.

Idea: ${ideaText}
Context: ${context}

Each question should relate to these business modules:
- problem_definition
- target_customer
- value_proposition
- revenue_model
- competitive_advantage

Questions should be open-ended and stimulate creative thinking.
Do not provide suggested answers. Let users answer freely.

Respond in JSON format:
{
  "questions": [
    {
      "moduleType": "problem_definition",
      "question": "Specific and thought-provoking question"
    }
  ]
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
                content: 'You are an expert business consultant. Always respond with valid JSON only, no additional text.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.8,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;

          if (content) {
            try {
              const questions = JSON.parse(content);
              console.log('OpenAI questions generated successfully');
              
              return new Response(
                JSON.stringify({
                  success: true,
                  questions: questions.questions || [],
                  source: 'openai'
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
              );
            } catch (parseError) {
              console.warn('OpenAI JSON parsing failed, using fallback');
            }
          }
        }
      } catch (openaiError) {
        console.warn('OpenAI request failed:', openaiError);
      }
    }

    // Fallback to enhanced default questions
    const fallbackQuestions = language === 'ko' ?
      [
        {
          moduleType: 'problem_definition',
          question: '이 아이디어가 해결하려는 가장 중요한 문제는 무엇인가요? 현재 사람들이 이 문제를 어떻게 해결하고 있나요?'
        },
        {
          moduleType: 'target_customer',
          question: '누가 이 솔루션을 가장 절실히 필요로 할까요? 그들의 하루 일과나 상황을 구체적으로 설명해보세요.'
        },
        {
          moduleType: 'value_proposition',
          question: '고객이 기존 방식을 버리고 당신의 아이디어를 선택해야 하는 결정적인 이유는 무엇인가요?'
        },
        {
          moduleType: 'revenue_model',
          question: '이 아이디어로 어떻게 지속 가능한 수익을 만들어낼 수 있을까요? 구체적인 방법을 설명해주세요.'
        },
        {
          moduleType: 'competitive_advantage',
          question: '비슷한 아이디어나 서비스가 이미 존재한다면, 당신만의 차별화된 접근법은 무엇인가요?'
        }
      ] :
      [
        {
          moduleType: 'problem_definition',
          question: 'What is the most critical problem this idea solves? How are people currently addressing this problem?'
        },
        {
          moduleType: 'target_customer',
          question: 'Who would most desperately need this solution? Can you describe their daily routine or situation in detail?'
        },
        {
          moduleType: 'value_proposition',
          question: 'What is the decisive reason customers should abandon their current approach and choose your idea?'
        },
        {
          moduleType: 'revenue_model',
          question: 'How can you generate sustainable revenue with this idea? Please explain specific methods.'
        },
        {
          moduleType: 'competitive_advantage',
          question: 'If similar ideas or services already exist, what is your unique differentiated approach?'
        }
      ];

    return new Response(
      JSON.stringify({
        success: true,
        questions: fallbackQuestions,
        source: 'fallback'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-smart-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
