
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

    console.log('Generating business validation questions:', { ideaLength: ideaText.length, context });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (OPENAI_API_KEY) {
      try {
        const prompt = language === 'ko' ? `
당신은 숙련된 비즈니스 멘토입니다. 사용자의 아이디어를 실용적으로 검증하고 구체화하기 위한 5개의 질문을 생성해주세요.

아이디어: "${ideaText}"

다음 순서대로 정확히 5개의 질문을 만들어주세요:
1. problem_definition - 해결하려는 문제가 무엇인지
2. target_customer - 누가 이 문제를 겪고 있는지  
3. value_proposition - 왜 당신의 솔루션을 선택해야 하는지
4. revenue_model - 어떻게 돈을 벌 것인지
5. competitive_advantage - 다른 솔루션과 어떻게 다른지

중요한 요구사항:
- 각 질문은 아이디어 "${ideaText}"와 직접적으로 연관되어야 합니다
- AI 역할이나 일반적인 질문 금지 - 오직 구체적인 비즈니스 검증 질문만
- 질문은 실제 창업자가 답변할 수 있는 현실적인 내용이어야 합니다
- 각 질문은 서로 완전히 달라야 합니다
- "당신의 아이디어" 대신 구체적 아이디어 내용 언급

JSON 형식으로 응답:
{
  "questions": [
    {
      "moduleType": "problem_definition",
      "question": "${ideaText}가 해결하려는 핵심 문제는 정확히 무엇인가요?"
    },
    {
      "moduleType": "target_customer", 
      "question": "누가 이 문제를 가장 절실하게 느끼나요?"
    },
    {
      "moduleType": "value_proposition",
      "question": "기존 방식 대신 이것을 선택해야 하는 이유는?"
    },
    {
      "moduleType": "revenue_model",
      "question": "수익은 어떻게 창출할 계획인가요?"
    },
    {
      "moduleType": "competitive_advantage",
      "question": "경쟁사와의 차별점은 무엇인가요?"
    }
  ]
}
` : `
You are an experienced business mentor. Generate 5 practical questions to validate and refine the user's idea.

Idea: "${ideaText}"

Create exactly 5 questions in this order:
1. problem_definition - What problem does this solve
2. target_customer - Who has this problem
3. value_proposition - Why choose your solution
4. revenue_model - How will you make money
5. competitive_advantage - How is this different

Critical requirements:
- Each question must directly relate to the idea "${ideaText}"
- NO AI role or general questions - only specific business validation questions
- Questions must be realistic for actual entrepreneurs to answer
- Each question must be completely different
- Reference the specific idea content, not "your idea"

Respond in JSON format:
{
  "questions": [
    {
      "moduleType": "problem_definition",
      "question": "What core problem does ${ideaText} solve?"
    },
    {
      "moduleType": "target_customer",
      "question": "Who desperately needs this solution?"
    },
    {
      "moduleType": "value_proposition", 
      "question": "Why choose this over existing options?"
    },
    {
      "moduleType": "revenue_model",
      "question": "How will you generate revenue?"
    },
    {
      "moduleType": "competitive_advantage",
      "question": "What's your competitive edge?"
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
                content: 'You are a business validation expert. Generate ONLY business-focused questions that help validate startup ideas. Never ask about AI or general topics. Always respond with valid JSON only.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;

          if (content) {
            try {
              const questions = JSON.parse(content);
              
              if (questions.questions && questions.questions.length === 5) {
                // Validate question order and content
                const expectedOrder = ['problem_definition', 'target_customer', 'value_proposition', 'revenue_model', 'competitive_advantage'];
                const orderedQuestions = expectedOrder.map(moduleType => 
                  questions.questions.find((q: any) => q.moduleType === moduleType)
                ).filter(Boolean);
                
                if (orderedQuestions.length === 5) {
                  console.log('OpenAI generated 5 ordered business questions successfully');
                  
                  return new Response(
                    JSON.stringify({
                      success: true,
                      questions: orderedQuestions,
                      source: 'openai'
                    }),
                    {
                      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    }
                  );
                }
              }
            } catch (parseError) {
              console.warn('OpenAI JSON parsing failed, using fallback');
            }
          }
        }
      } catch (openaiError) {
        console.warn('OpenAI request failed:', openaiError);
      }
    }

    // Enhanced fallback questions with proper ordering
    const fallbackQuestions = language === 'ko' ?
      [
        {
          moduleType: 'problem_definition',
          question: `"${ideaText}"가 해결하려는 가장 중요한 문제는 무엇인가요? 현재 사람들이 이 문제를 어떻게 해결하고 있나요?`
        },
        {
          moduleType: 'target_customer',
          question: `누가 이 문제를 가장 절실하게 느끼고 있을까요? 그들의 하루 일과나 상황을 구체적으로 설명해보세요.`
        },
        {
          moduleType: 'value_proposition',
          question: `기존 방식을 버리고 "${ideaText}"를 선택해야 하는 결정적인 이유는 무엇인가요?`
        },
        {
          moduleType: 'revenue_model',
          question: `"${ideaText}"로 어떻게 지속 가능한 수익을 만들어낼 수 있을까요? 구체적인 방법을 설명해주세요.`
        },
        {
          moduleType: 'competitive_advantage',
          question: `비슷한 서비스가 이미 존재한다면, "${ideaText}"만의 차별화된 접근법은 무엇인가요?`
        }
      ] :
      [
        {
          moduleType: 'problem_definition',
          question: `What is the most critical problem that "${ideaText}" solves? How are people currently addressing this problem?`
        },
        {
          moduleType: 'target_customer',
          question: `Who would most desperately need "${ideaText}"? Can you describe their daily routine or situation in detail?`
        },
        {
          moduleType: 'value_proposition',
          question: `What is the decisive reason customers should choose "${ideaText}" over existing approaches?`
        },
        {
          moduleType: 'revenue_model',
          question: `How can "${ideaText}" generate sustainable revenue? Please explain specific methods.`
        },
        {
          moduleType: 'competitive_advantage',
          question: `If similar services already exist, what is "${ideaText}"'s unique differentiated approach?`
        }
      ];

    console.log('Using enhanced fallback questions with proper ordering');

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
