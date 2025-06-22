
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

    if (!ideaText || ideaText.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Idea text must be at least 10 characters long' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = language === 'ko' ? `
다음 아이디어를 12개의 비즈니스 모듈로 분해해주세요. 각 모듈은 간결하고 명확하게 작성해주세요:

아이디어: ${ideaText}

다음 JSON 형식으로 응답해주세요:
{
  "problem": "해결하려는 문제점",
  "solution": "제공하는 솔루션",
  "target_customer": "타겟 고객",
  "value_proposition": "가치 제안",
  "revenue_model": "수익 모델",
  "key_activities": "핵심 활동",
  "key_resources": "핵심 자원",
  "channels": "유통 채널",
  "competitive_advantage": "경쟁 우위",
  "market_size": "시장 규모",
  "team": "팀 구성",
  "potential_risks": "잠재 리스크"
}
` : `
Please decompose the following idea into 12 business modules. Each module should be concise and clear:

Idea: ${ideaText}

Please respond in the following JSON format:
{
  "problem": "Problem being solved",
  "solution": "Solution provided",
  "target_customer": "Target customer segment",
  "value_proposition": "Value proposition",
  "revenue_model": "Revenue model",
  "key_activities": "Key activities",
  "key_resources": "Key resources",
  "channels": "Distribution channels",
  "competitive_advantage": "Competitive advantage",
  "market_size": "Market size",
  "team": "Team composition",
  "potential_risks": "Potential risks"
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
            content: 'You are an expert business analyst. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
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

    let decomposition;
    try {
      decomposition = JSON.parse(content);
    } catch (parseError) {
      // Fallback decomposition if JSON parsing fails
      decomposition = {
        problem: '사용자 니즈 파악 필요',
        solution: ideaText.substring(0, 100),
        target_customer: '타겟 고객 분석 필요',
        value_proposition: '가치 제안 구체화 필요',
        revenue_model: '수익 모델 개발 필요',
        key_activities: '핵심 활동 정의 필요',
        key_resources: '필요 자원 분석 필요',
        channels: '유통 채널 계획 필요',
        competitive_advantage: '차별화 요소 개발 필요',
        market_size: '시장 분석 필요',
        team: '팀 구성 계획 필요',
        potential_risks: '리스크 분석 필요'
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        decomposition,
        originalIdea: ideaText
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in decompose-idea function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
