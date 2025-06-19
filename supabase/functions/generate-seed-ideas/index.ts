
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SeedIdea {
  text_ko: string;
  text_en: string;
  score: number;
  tags_ko: string[];
  tags_en: string[];
  analysis_ko: string;
  analysis_en: string;
  improvements_ko: string[];
  improvements_en: string[];
  market_potential_ko: string[];
  market_potential_en: string[];
  similar_ideas_ko: string[];
  similar_ideas_en: string[];
  pitch_points_ko: string[];
  pitch_points_en: string[];
}

const seedIdeas: SeedIdea[] = [
  {
    text_ko: "스마트폰 카메라로 음식을 찍으면 칼로리와 영양성분을 자동으로 분석해주는 AI 헬스케어 앱",
    text_en: "AI healthcare app that automatically analyzes calories and nutritional content by taking photos of food with smartphone camera",
    score: 8.2,
    tags_ko: ["AI", "헬스케어", "푸드테크"],
    tags_en: ["AI", "Healthcare", "FoodTech"],
    analysis_ko: "이미지 인식 기술과 영양학 데이터베이스를 결합한 혁신적인 헬스케어 솔루션입니다.",
    analysis_en: "An innovative healthcare solution combining image recognition technology with nutritional databases.",
    improvements_ko: ["정확도 향상을 위한 머신러닝 모델 개선", "더 많은 음식 데이터베이스 구축"],
    improvements_en: ["Improve machine learning models for better accuracy", "Build larger food database"],
    market_potential_ko: ["건강 의식 증가로 큰 시장 잠재력", "다이어트 앱 시장과의 연계 가능"],
    market_potential_en: ["Large market potential due to growing health consciousness", "Possible integration with diet app market"],
    similar_ideas_ko: ["MyFitnessPal", "Lose It!", "Yazio"],
    similar_ideas_en: ["MyFitnessPal", "Lose It!", "Yazio"],
    pitch_points_ko: ["간편한 사용법", "정확한 영양분석", "개인화된 건강 관리"],
    pitch_points_en: ["Easy to use", "Accurate nutrition analysis", "Personalized health management"]
  },
  {
    text_ko: "중고차 구매 시 AI가 차량 상태를 실시간으로 진단하고 적정가격을 제시하는 플랫폼",
    text_en: "Platform where AI diagnoses vehicle condition in real-time and suggests fair prices when buying used cars",
    score: 7.8,
    tags_ko: ["AI", "자동차", "핀테크"],
    tags_en: ["AI", "Automotive", "FinTech"],
    analysis_ko: "중고차 시장의 정보 비대칭성을 해결하는 혁신적인 AI 기반 솔루션입니다.",
    analysis_en: "Innovative AI-based solution that solves information asymmetry in the used car market.",
    improvements_ko: ["더 정확한 차량 진단 알고리즘 개발", "딜러와의 파트너십 확대"],
    improvements_en: ["Develop more accurate vehicle diagnostic algorithms", "Expand partnerships with dealers"],
    market_potential_ko: ["중고차 시장 규모 확대", "디지털 전환 가속화"],
    market_potential_en: ["Growing used car market size", "Accelerating digital transformation"],
    similar_ideas_ko: ["카구루", "엔카", "KB차차차"],
    similar_ideas_en: ["Cargurus", "AutoTrader", "CarMax"],
    pitch_points_ko: ["투명한 가격 책정", "전문가 수준의 진단", "안전한 거래"],
    pitch_points_en: ["Transparent pricing", "Expert-level diagnosis", "Safe transactions"]
  },
  {
    text_ko: "반려동물의 행동 패턴을 분석해 건강 상태와 감정을 파악하는 IoT 웨어러블 디바이스",
    text_en: "IoT wearable device that analyzes pet behavior patterns to understand health status and emotions",
    score: 8.5,
    tags_ko: ["IoT", "펫테크", "헬스케어"],
    tags_en: ["IoT", "PetTech", "Healthcare"],
    analysis_ko: "반려동물 시장의 성장과 함께 펫테크 분야의 혁신적인 솔루션으로 평가됩니다.",
    analysis_en: "Evaluated as an innovative solution in the PetTech sector along with the growth of the pet market.",
    improvements_ko: ["배터리 수명 연장", "더 다양한 동물 종에 대한 지원"],
    improvements_en: ["Extend battery life", "Support for more diverse animal species"],
    market_potential_ko: ["반려동물 시장 급성장", "프리미엄 펫케어 트렌드"],
    market_potential_en: ["Rapid growth in pet market", "Premium pet care trends"],
    similar_ideas_ko: ["펫핏", "위슬", "핏바크"],
    similar_ideas_en: ["Petfit", "Whistle", "FitBark"],
    pitch_points_ko: ["반려동물 건강 모니터링", "조기 질병 발견", "주인과의 소통 개선"],
    pitch_points_en: ["Pet health monitoring", "Early disease detection", "Improved owner communication"]
  },
  {
    text_ko: "온라인 수업 중 학생들의 집중도를 실시간으로 측정하고 맞춤형 학습 콘텐츠를 제공하는 에듀테크 플랫폼",
    text_en: "EdTech platform that measures student concentration in real-time during online classes and provides personalized learning content",
    score: 7.9,
    tags_ko: ["에듀테크", "AI", "교육"],
    tags_en: ["EdTech", "AI", "Education"],
    analysis_ko: "포스트 코로나 시대의 온라인 교육 품질 향상을 위한 필수적인 솔루션입니다.",
    analysis_en: "Essential solution for improving online education quality in the post-COVID era.",
    improvements_ko: ["프라이버시 보호 강화", "다양한 학습 스타일 지원"],
    improvements_en: ["Strengthen privacy protection", "Support various learning styles"],
    market_potential_ko: ["온라인 교육 시장 확대", "개인화 학습 수요 증가"],
    market_potential_en: ["Expanding online education market", "Growing demand for personalized learning"],
    similar_ideas_ko: ["클래스팅", "엘리스", "코드잇"],
    similar_ideas_en: ["Coursera", "Khan Academy", "Udemy"],
    pitch_points_ko: ["실시간 집중도 분석", "개인화된 학습 경험", "학습 효과 극대화"],
    pitch_points_en: ["Real-time concentration analysis", "Personalized learning experience", "Maximized learning effectiveness"]
  },
  {
    text_ko: "블록체인 기반 탄소배출권 거래 플랫폼으로 개인과 기업의 친환경 활동을 토큰화",
    text_en: "Blockchain-based carbon credit trading platform that tokenizes eco-friendly activities of individuals and companies",
    score: 8.0,
    tags_ko: ["블록체인", "환경", "핀테크"],
    tags_en: ["Blockchain", "Environment", "FinTech"],
    analysis_ko: "ESG 경영과 탄소중립 정책으로 인해 급성장이 예상되는 분야입니다.",
    analysis_en: "A field expected to grow rapidly due to ESG management and carbon neutral policies.",
    improvements_ko: ["정부 인증 체계 연동", "사용자 친화적 인터페이스 개발"],
    improvements_en: ["Integration with government certification systems", "Development of user-friendly interface"],
    market_potential_ko: ["탄소배출권 시장 확대", "ESG 투자 증가"],
    market_potential_en: ["Expanding carbon credit market", "Increasing ESG investment"],
    similar_ideas_ko: ["클라이밋체인", "카본플러스", "에코체인"],
    similar_ideas_en: ["ClimateChain", "CarbonPlace", "Toucan Protocol"],
    pitch_points_ko: ["투명한 탄소 거래", "개인 참여 활성화", "검증 가능한 환경 기여"],
    pitch_points_en: ["Transparent carbon trading", "Active individual participation", "Verifiable environmental contribution"]
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Get user from the JWT token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const { language = 'ko' } = await req.json().catch(() => ({}));

    // Check if seed data already exists
    const { data: existingSeed, error: checkError } = await supabaseClient
      .from('ideas')
      .select('id')
      .eq('seed', true)
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingSeed && existingSeed.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Seed data already exists' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Use the actual user ID instead of a dummy one
    const seedUserId = user.id;

    // Prepare seed data for insertion
    const seedDataToInsert = seedIdeas.map(idea => ({
      user_id: seedUserId,
      text: language === 'ko' ? idea.text_ko : idea.text_en,
      score: idea.score,
      tags: language === 'ko' ? idea.tags_ko : idea.tags_en,
      ai_analysis: language === 'ko' ? idea.analysis_ko : idea.analysis_en,
      improvements: language === 'ko' ? idea.improvements_ko : idea.improvements_en,
      market_potential: language === 'ko' ? idea.market_potential_ko : idea.market_potential_en,
      similar_ideas: language === 'ko' ? idea.similar_ideas_ko : idea.similar_ideas_en,
      pitch_points: language === 'ko' ? idea.pitch_points_ko : idea.pitch_points_en,
      seed: true,
      likes_count: Math.floor(Math.random() * 10) + 1 // Random likes between 1-10
    }));

    // Insert seed data
    const { data, error } = await supabaseClient
      .from('ideas')
      .insert(seedDataToInsert);

    if (error) {
      throw error;
    }

    console.log(`Successfully generated ${seedIdeas.length} seed ideas in ${language}`);

    return new Response(
      JSON.stringify({ 
        message: `Successfully generated ${seedIdeas.length} seed ideas`,
        count: seedIdeas.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating seed ideas:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
