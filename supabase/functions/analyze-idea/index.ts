
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IdeaAnalysisRequest {
  ideaText: string;
  language: 'ko' | 'en';
  securityCheck?: boolean;
  userId?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// Security and anti-gaming measures
async function performSecurityChecks(ideaText: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Rate limiting check - max 5 analyses per day per user
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAnalyses, error: rateError } = await supabase
      .from('ideas')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .not('ai_analysis', 'is', null);

    if (rateError) {
      console.error('Rate limit check error:', rateError);
      return { success: false, error: 'RATE_LIMIT_CHECK_FAILED' };
    }

    if (todayAnalyses && todayAnalyses.length >= 5) {
      return { success: false, error: 'RATE_LIMIT' };
    }

    // Quality check - minimum character count and structure
    if (ideaText.length < 50) {
      return { success: false, error: 'QUALITY' };
    }

    // Simple duplicate detection using text similarity
    const ideaHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ideaText.toLowerCase().trim()));
    const hashArray = Array.from(new Uint8Array(ideaHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data: similarIdeas, error: duplicateError } = await supabase
      .from('ideas')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    if (duplicateError) {
      console.error('Duplicate check error:', duplicateError);
    } else if (similarIdeas && similarIdeas.length > 0) {
      // Check for similar content (basic check)
      const words = ideaText.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      const uniqueWords = new Set(words);
      
      if (uniqueWords.size < Math.max(5, words.length * 0.3)) {
        return { success: false, error: 'DUPLICATE' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Security check failed:', error);
    return { success: false, error: 'SECURITY_CHECK_FAILED' };
  }
}

// Enhanced AI analysis with stricter scoring
async function analyzeIdeaWithAI(ideaText: string, language: 'ko' | 'en') {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = language === 'ko' 
    ? `당신은 경험이 풍부한 벤처캐피털리스트입니다. 다음 아이디어를 매우 엄격하게 평가해주세요.

평가 기준 (각 항목당 0-2점, 총 10점 만점):
1. 문제 정의의 명확성과 시급성
2. 해결책의 혁신성과 실현가능성
3. 시장 규모와 성장 잠재력
4. 경쟁 우위와 차별화 요소
5. 수익 모델의 구체성과 지속가능성

8.5점 이상은 극히 예외적인 경우에만 부여하세요. 대부분의 아이디어는 5-7점 범위에 있어야 합니다.

아이디어: "${ideaText}"

다음 JSON 형식으로 응답해주세요:
{
  "score": [1-10 점수],
  "analysis": "상세한 분석 (300자 이상)",
  "improvements": ["개선점1", "개선점2", "개선점3"],
  "marketPotential": "시장 잠재력 분석 (200자 이상)",
  "tags": ["태그1", "태그2", "태그3"],
  "pitchPoints": ["핵심 피칭 포인트1", "핵심 피칭 포인트2"],
  "similarIdeas": ["유사 아이디어/서비스1", "유사 아이디어/서비스2"]
}`
    : `You are an experienced venture capitalist. Please evaluate the following idea very strictly.

Evaluation criteria (0-2 points each, total 10 points):
1. Clarity and urgency of problem definition
2. Innovation and feasibility of solution
3. Market size and growth potential
4. Competitive advantage and differentiation
5. Specificity and sustainability of revenue model

Only award 8.5+ points in truly exceptional cases. Most ideas should fall in the 5-7 point range.

Idea: "${ideaText}"

Please respond in the following JSON format:
{
  "score": [1-10 score],
  "analysis": "Detailed analysis (300+ characters)",
  "improvements": ["Improvement1", "Improvement2", "Improvement3"],
  "marketPotential": "Market potential analysis (200+ characters)",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "pitchPoints": ["Key pitch point1", "Key pitch point2"],
  "similarIdeas": ["Similar idea/service1", "Similar idea/service2"]
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent scoring
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new Error('No content generated from Gemini API');
  }

  try {
    const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResult = JSON.parse(cleanedText);
    
    // Additional score validation - prevent gaming
    if (parsedResult.score > 8.5) {
      // Double-check high scores with additional criteria
      const ideaLength = ideaText.length;
      const hasBusinessModel = ideaText.toLowerCase().includes('수익') || ideaText.toLowerCase().includes('revenue') || ideaText.toLowerCase().includes('비즈니스');
      const hasMarketAnalysis = ideaText.toLowerCase().includes('시장') || ideaText.toLowerCase().includes('market') || ideaText.toLowerCase().includes('고객');
      
      if (ideaLength < 200 || !hasBusinessModel || !hasMarketAnalysis) {
        parsedResult.score = Math.min(parsedResult.score, 7.5);
      }
    }
    
    return parsedResult;
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError);
    console.log('Raw response:', generatedText);
    throw new Error('Failed to parse AI analysis result');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ideaText, language, securityCheck, userId }: IdeaAnalysisRequest = await req.json();
    
    console.log('Analysis request:', { 
      ideaLength: ideaText?.length, 
      language, 
      securityCheck, 
      userId: userId ? 'provided' : 'missing' 
    });

    if (!ideaText || !language) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Security check phase
    if (securityCheck && userId) {
      const securityResult = await performSecurityChecks(ideaText, userId);
      if (!securityResult.success) {
        return new Response(
          JSON.stringify({ error: securityResult.error }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // AI Analysis phase
    const analysisResult = await analyzeIdeaWithAI(ideaText, language);
    
    console.log('Analysis completed:', { 
      score: analysisResult.score, 
      analysisLength: analysisResult.analysis?.length 
    });

    return new Response(
      JSON.stringify(analysisResult),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-idea function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
