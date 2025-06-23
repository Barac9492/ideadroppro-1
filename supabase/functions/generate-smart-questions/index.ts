
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

중요한 요구사항:
1. 각 질문은 완전히 다르고 독특해야 합니다
2. 절대 유사하거나 중복되는 질문을 만들지 마세요
3. 각 모듈당 정확히 하나의 질문만 생성하세요
4. 질문은 구체적이고 실용적이어야 합니다
5. 개방형 질문으로 사용자의 창의적 사고를 자극해야 합니다

JSON 형식으로 응답:
{
  "questions": [
    {
      "moduleType": "problem_definition",
      "question": "구체적이고 생각을 자극하는 질문"
    },
    {
      "moduleType": "target_customer", 
      "question": "완전히 다른 각도의 질문"
    },
    {
      "moduleType": "value_proposition",
      "question": "또 다른 독특한 질문"
    },
    {
      "moduleType": "revenue_model",
      "question": "수익에 대한 구체적 질문"
    },
    {
      "moduleType": "competitive_advantage",
      "question": "경쟁 우위에 대한 질문"
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

Critical requirements:
1. Each question must be completely different and unique
2. Never create similar or duplicate questions
3. Generate exactly one question per module
4. Questions should be specific and practical
5. Questions should be open-ended and stimulate creative thinking

Respond in JSON format:
{
  "questions": [
    {
      "moduleType": "problem_definition",
      "question": "Specific and thought-provoking question"
    },
    {
      "moduleType": "target_customer",
      "question": "Completely different angle question"
    },
    {
      "moduleType": "value_proposition", 
      "question": "Another unique question"
    },
    {
      "moduleType": "revenue_model",
      "question": "Specific revenue question"
    },
    {
      "moduleType": "competitive_advantage",
      "question": "Competitive advantage question"
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
                content: 'You are an expert business consultant. Generate unique, non-repetitive questions for each module. Each question must be completely different. Always respond with valid JSON only, no additional text.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.9,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;

          if (content) {
            try {
              const questions = JSON.parse(content);
              
              // 엄격한 중복 제거 및 검증
              const uniqueQuestions = questions.questions.filter((question: any, index: number, arr: any[]) => {
                const normalizedQuestion = question.question.toLowerCase().trim();
                const firstIndex = arr.findIndex((q: any) => q.question.toLowerCase().trim() === normalizedQuestion);
                return firstIndex === index;
              });
              
              // 각 모듈 타입별로 하나씩만 유지
              const moduleMap = new Map();
              uniqueQuestions.forEach((question: any) => {
                if (!moduleMap.has(question.moduleType)) {
                  moduleMap.set(question.moduleType, question);
                }
              });
              
              const finalQuestions = Array.from(moduleMap.values()).slice(0, 5);
              
              console.log('OpenAI questions generated successfully');
              
              return new Response(
                JSON.stringify({
                  success: true,
                  questions: finalQuestions,
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

    // Enhanced fallback questions - 완전히 다른 질문들
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
