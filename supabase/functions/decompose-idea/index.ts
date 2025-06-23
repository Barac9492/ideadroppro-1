
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { ideaText, language = 'ko' } = await req.json()

    if (!ideaText) {
      return new Response(
        JSON.stringify({ success: false, error: 'Idea text is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Check if OPENAI_API_KEY is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key is not configured. Please add your OpenAI API key in the project settings.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Decomposing idea:', ideaText)

    const prompt = language === 'ko' 
      ? `다음 아이디어를 비즈니스 모델 구성 요소로 분해해주세요. 각 요소를 간결하고 명확하게 작성해주세요:

아이디어: "${ideaText}"

다음 JSON 형태로 응답해주세요:
{
  "problem": "해결하려는 문제점",
  "solution": "제안하는 솔루션",
  "target_customer": "타겟 고객층",
  "value_proposition": "핵심 가치 제안",
  "revenue_model": "수익 모델",
  "key_activities": "핵심 활동",
  "key_resources": "핵심 자원",
  "channels": "유통 채널",
  "competitive_advantage": "경쟁 우위",
  "market_size": "시장 규모",
  "team": "필요한 팀 구성",
  "potential_risks": "잠재적 리스크"
}`
      : `Please decompose the following idea into business model components. Write each component concisely and clearly:

Idea: "${ideaText}"

Please respond in the following JSON format:
{
  "problem": "Problem being solved",
  "solution": "Proposed solution",
  "target_customer": "Target customer segment",
  "value_proposition": "Core value proposition",
  "revenue_model": "Revenue model",
  "key_activities": "Key activities",
  "key_resources": "Key resources",
  "channels": "Distribution channels",
  "competitive_advantage": "Competitive advantage",
  "market_size": "Market size",
  "team": "Required team composition",
  "potential_risks": "Potential risks"
}`

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
              ? '당신은 비즈니스 모델 분석 전문가입니다. 아이디어를 구조화된 비즈니스 모델 구성 요소로 분해하는 것이 당신의 역할입니다.'
              : 'You are a business model analysis expert. Your role is to decompose ideas into structured business model components.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      
      let errorMessage = 'Failed to decompose idea'
      if (response.status === 401) {
        errorMessage = language === 'ko' 
          ? 'OpenAI API 키가 유효하지 않습니다. 프로젝트 설정에서 올바른 API 키를 입력해주세요.'
          : 'OpenAI API key is invalid. Please enter a valid API key in project settings.'
      } else if (response.status === 429) {
        errorMessage = language === 'ko'
          ? 'OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
          : 'OpenAI API rate limit exceeded. Please try again later.'
      } else if (response.status === 402) {
        errorMessage = language === 'ko'
          ? 'OpenAI 계정의 크레딧이 부족합니다. OpenAI 계정을 확인해주세요.'
          : 'Insufficient OpenAI credits. Please check your OpenAI account.'
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    console.log('OpenAI response:', content)

    // Parse the JSON response
    let decomposition
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        decomposition = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      throw new Error(language === 'ko' 
        ? 'AI 응답을 분석하는데 실패했습니다. 다시 시도해주세요.'
        : 'Failed to parse AI response. Please try again.')
    }

    console.log('Parsed decomposition:', decomposition)

    return new Response(
      JSON.stringify({ success: true, decomposition }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error in decompose-idea function:', error)
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
