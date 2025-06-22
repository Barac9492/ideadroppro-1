
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

    const { selectedModules, targetModuleType, language = 'ko' } = await req.json();

    // Get compatible modules from database
    const { data: modules, error } = await supabaseClient
      .from('idea_modules')
      .select('*')
      .eq('module_type', targetModuleType)
      .order('quality_score', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Use AI to rank and recommend the most compatible modules
    const selectedModuleDescriptions = selectedModules.map((m: any) => 
      `${m.module_type}: ${m.content}`
    ).join('\n');

    const moduleOptions = modules?.map(m => 
      `ID: ${m.id}, Content: ${m.content}`
    ).join('\n') || '';

    const prompt = language === 'ko' ? `
다음 선택된 모듈들과 가장 잘 어울리는 ${targetModuleType} 모듈을 추천해주세요:

선택된 모듈들:
${selectedModuleDescriptions}

추천 후보 모듈들:
${moduleOptions}

각 모듈에 대해 1-10점으로 호환성을 평가하고, 상위 3개를 추천 이유와 함께 JSON 형식으로 응답해주세요:
{
  "recommendations": [
    {
      "moduleId": "모듈 ID",
      "score": 점수,
      "reason": "추천 이유"
    }
  ]
}
` : `
Please recommend the most compatible ${targetModuleType} modules for the following selected modules:

Selected modules:
${selectedModuleDescriptions}

Candidate modules:
${moduleOptions}

Rate each module's compatibility from 1-10 and recommend the top 3 with reasons in JSON format:
{
  "recommendations": [
    {
      "moduleId": "module ID",
      "score": score,
      "reason": "recommendation reason"
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
            content: 'You are an expert business consultant. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    let recommendations;
    try {
      recommendations = JSON.parse(content || '{"recommendations": []}');
    } catch {
      recommendations = { recommendations: [] };
    }

    // Enhance recommendations with full module data
    const enhancedRecommendations = await Promise.all(
      recommendations.recommendations.map(async (rec: any) => {
        const module = modules?.find(m => m.id === rec.moduleId);
        return {
          ...rec,
          module: module || null
        };
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: enhancedRecommendations.filter(r => r.module)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in recommend-modules function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
