
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

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

    const { ideaText, language = 'ko' } = await req.json();

    if (!ideaText || ideaText.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: 'Idea text must be at least 5 characters long' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = language === 'ko' ? `
다음 아이디어를 분석하고, 부족한 부분을 보완하기 위한 5개의 스마트한 질문을 생성해주세요:

아이디어: ${ideaText}

각 질문은 다음 비즈니스 모듈 중 하나와 연관되어야 합니다:
- problem (문제점)
- target_customer (타겟 고객)
- value_proposition (가치 제안)
- revenue_model (수익 모델)
- competitive_advantage (경쟁 우위)

각 질문에는 3-4개의 선택 가능한 답변 옵션도 제공해주세요.

다음 JSON 형식으로 응답해주세요:
{
  "questions": [
    {
      "moduleType": "problem",
      "question": "구체적인 질문 텍스트",
      "suggestedAnswers": ["옵션1", "옵션2", "옵션3", "옵션4"]
    }
  ]
}
` : `
Analyze the following idea and generate 5 smart questions to help complete missing aspects:

Idea: ${ideaText}

Each question should relate to one of these business modules:
- problem
- target_customer  
- value_proposition
- revenue_model
- competitive_advantage

Provide 3-4 selectable answer options for each question.

Respond in the following JSON format:
{
  "questions": [
    {
      "moduleType": "problem",
      "question": "Specific question text",
      "suggestedAnswers": ["Option1", "Option2", "Option3", "Option4"]
    }
  ]
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    let questions;
    try {
      questions = JSON.parse(content);
    } catch (parseError) {
      // Fallback questions if JSON parsing fails
      questions = {
        questions: language === 'ko' ? [
          {
            moduleType: 'problem',
            question: '이 아이디어가 해결하려는 핵심 문제는 무엇인가요?',
            suggestedAnswers: ['효율성 부족', '높은 비용', '접근성 문제', '품질 문제']
          },
          {
            moduleType: 'target_customer',
            question: '주요 타겟 고객은 누구인가요?',
            suggestedAnswers: ['개인 사용자', '중소기업', '대기업', '정부기관']
          },
          {
            moduleType: 'value_proposition',
            question: '고객에게 제공하는 핵심 가치는 무엇인가요?',
            suggestedAnswers: ['시간 절약', '비용 절감', '편의성 증대', '품질 향상']
          }
        ] : [
          {
            moduleType: 'problem',
            question: 'What core problem does this idea solve?',
            suggestedAnswers: ['Efficiency issues', 'High costs', 'Accessibility problems', 'Quality issues']
          },
          {
            moduleType: 'target_customer',
            question: 'Who is your main target customer?',
            suggestedAnswers: ['Individual users', 'Small businesses', 'Enterprises', 'Government']
          },
          {
            moduleType: 'value_proposition',
            question: 'What core value do you provide?',
            suggestedAnswers: ['Time saving', 'Cost reduction', 'Convenience', 'Quality improvement']
          }
        ]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        questions: questions.questions || []
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
