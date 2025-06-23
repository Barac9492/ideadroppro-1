
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { originalIdea, modules, language = 'ko' } = await req.json()

    if (!originalIdea || !modules) {
      return new Response(
        JSON.stringify({ success: false, error: 'Original idea and modules are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key is not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Generating unified idea from:', originalIdea, modules)

    const moduleText = Object.entries(modules)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    const prompt = language === 'ko' 
      ? `다음의 원본 아이디어와 분해된 모듈들을 자연스럽게 통합하여 하나의 완성된 아이디어 문장으로 만들어주세요.

원본 아이디어: "${originalIdea}"

분해된 모듈들:
${moduleText}

위 정보들을 종합하여 구체적이고 매력적인 하나의 아이디어 문장으로 만들어주세요. 단순히 나열하지 말고, 자연스럽게 흘러가는 하나의 완성된 아이디어로 작성해주세요.`
      : `Please integrate the following original idea and decomposed modules into one natural, complete idea sentence.

Original idea: "${originalIdea}"

Decomposed modules:
${moduleText}

Please synthesize the above information into one concrete and attractive idea sentence. Don't just list them, but create one naturally flowing, complete idea.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: language === 'ko' 
              ? '당신은 아이디어를 자연스럽고 매력적인 문장으로 완성하는 전문가입니다.'
              : 'You are an expert at creating natural and attractive idea sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error('Failed to generate unified idea')
    }

    const data = await response.json()
    const unifiedIdea = data.choices[0]?.message?.content

    if (!unifiedIdea) {
      throw new Error('No response from OpenAI')
    }

    console.log('Generated unified idea:', unifiedIdea)

    return new Response(
      JSON.stringify({ success: true, unifiedIdea }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error in generate-unified-idea function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
