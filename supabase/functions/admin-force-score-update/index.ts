
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
    // 관리자 전용 서비스 역할 클라이언트 생성
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ideaIds } = await req.json();

    console.log(`📋 Admin force update started: ${action}`);

    if (action === 'fix_all_zero_scores') {
      // 모든 0점 아이디어 조회 (RLS 무시)
      const { data: zeroScoreIdeas, error: fetchError } = await supabaseAdmin
        .from('ideas')
        .select('id, text, user_id')
        .or('score.eq.0,score.is.null')
        .eq('seed', false);

      if (fetchError) {
        console.error('❌ Failed to fetch zero score ideas:', fetchError);
        throw fetchError;
      }

      console.log(`🎯 Found ${zeroScoreIdeas?.length || 0} zero score ideas`);

      if (!zeroScoreIdeas || zeroScoreIdeas.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'No zero score ideas found',
            updated: 0 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let successCount = 0;
      const errors = [];

      // 각 아이디어를 강제로 업데이트
      for (const idea of zeroScoreIdeas) {
        try {
          // 보장된 점수 계산
          const guaranteedScore = calculateGuaranteedScore(idea.text);
          
          // 서비스 역할로 직접 업데이트 (RLS 무시)
          const { error: updateError } = await supabaseAdmin
            .from('ideas')
            .update({
              score: guaranteedScore,
              ai_analysis: `관리자 강제 수정: ${guaranteedScore}점으로 업데이트되었습니다. 텍스트 품질과 키워드 분석을 통해 계산된 점수입니다.`,
              tags: ['관리자수정', '강제업데이트'],
              improvements: ['구체적인 실행 계획 수립', '시장 분석 강화'],
              market_potential: ['타겟 고객 명확화', '수익 모델 구체화'],
              similar_ideas: ['기존 솔루션 조사'],
              pitch_points: ['독창적인 아이디어', '시장 잠재력'],
              updated_at: new Date().toISOString()
            })
            .eq('id', idea.id);

          if (updateError) {
            console.error(`❌ Failed to update idea ${idea.id}:`, updateError);
            errors.push({ ideaId: idea.id, error: updateError.message });
          } else {
            successCount++;
            console.log(`✅ Successfully updated idea ${idea.id} with score ${guaranteedScore}`);
          }
        } catch (error) {
          console.error(`💥 Error processing idea ${idea.id}:`, error);
          errors.push({ ideaId: idea.id, error: error.message });
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          updated: successCount,
          total: zeroScoreIdeas.length,
          errors: errors.slice(0, 5) // 최대 5개 에러만 반환
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 특정 아이디어들 수정
    if (action === 'fix_specific_ideas' && ideaIds) {
      let successCount = 0;
      const errors = [];

      for (const ideaId of ideaIds) {
        try {
          // 아이디어 조회
          const { data: idea, error: fetchError } = await supabaseAdmin
            .from('ideas')
            .select('id, text')
            .eq('id', ideaId)
            .single();

          if (fetchError || !idea) {
            errors.push({ ideaId, error: 'Idea not found' });
            continue;
          }

          const guaranteedScore = calculateGuaranteedScore(idea.text);
          
          const { error: updateError } = await supabaseAdmin
            .from('ideas')
            .update({
              score: guaranteedScore,
              ai_analysis: `관리자 개별 수정: ${guaranteedScore}점으로 업데이트되었습니다.`,
              tags: ['관리자수정', '개별업데이트'],
              updated_at: new Date().toISOString()
            })
            .eq('id', ideaId);

          if (updateError) {
            errors.push({ ideaId, error: updateError.message });
          } else {
            successCount++;
          }
        } catch (error) {
          errors.push({ ideaId, error: error.message });
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          updated: successCount,
          total: ideaIds.length,
          errors
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('💥 Admin force update failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// 보장된 점수 계산 함수
function calculateGuaranteedScore(ideaText: string): number {
  let score = 5.0; // 안전한 기본 점수
  
  const textLength = ideaText.trim().length;
  if (textLength > 30) score += 0.5;
  if (textLength > 80) score += 0.8;
  if (textLength > 150) score += 0.7;
  if (textLength > 250) score += 0.5;
  
  const sentences = ideaText.split(/[.!?]/).filter(s => s.trim().length > 10);
  score += Math.min(sentences.length * 0.3, 1.2);
  
  const keywords = ['AI', '인공지능', '앱', '서비스', '플랫폼', '시스템', '솔루션', '기술', '비즈니스', '혁신', '스마트', '디지털', '자동화'];
  const matchedKeywords = keywords.filter(keyword => 
    ideaText.toLowerCase().includes(keyword.toLowerCase())
  );
  score += Math.min(matchedKeywords.length * 0.4, 2.0);
  
  if (/\p{Emoji}/u.test(ideaText)) score += 0.5;
  if (/\d+/.test(ideaText)) score += 0.4;
  
  const randomBonus = Math.random() * 1.0;
  score += randomBonus;
  
  const finalScore = Math.max(4.0, Math.min(9.0, score));
  return parseFloat(finalScore.toFixed(1));
}
