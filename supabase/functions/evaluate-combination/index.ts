
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Module {
  id: string;
  content: string;
  module_type: string;
  embedding: number[];
  usage_count: number;
  quality_score: number;
}

interface CombinationScore {
  novelty_score: number;
  complementarity_score: number;
  marketability_score: number;
  overall_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { module_ids } = await req.json()

    if (!module_ids || !Array.isArray(module_ids) || module_ids.length < 2) {
      throw new Error('At least 2 module IDs are required')
    }

    // 모듈 정보 가져오기
    const { data: modules, error: modulesError } = await supabaseClient
      .from('idea_modules')
      .select('id, content, module_type, embedding, usage_count, quality_score')
      .in('id', module_ids)

    if (modulesError) throw modulesError

    if (!modules || modules.length !== module_ids.length) {
      throw new Error('Some modules not found')
    }

    // 기존 조합들 가져오기 (신선도 계산용)
    const { data: existingCombinations } = await supabaseClient
      .from('module_combinations')
      .select('module_ids, overall_score')

    const scores = await calculateCombinationScores(
      modules as Module[],
      existingCombinations || []
    )

    return new Response(
      JSON.stringify({ success: true, scores }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error evaluating combination:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function calculateCombinationScores(
  modules: Module[],
  existingCombinations: any[]
): Promise<CombinationScore> {
  // 1. 신선도(Novelty) 점수 계산
  const noveltyScore = calculateNoveltyScore(modules, existingCombinations)
  
  // 2. 상보성(Complementarity) 점수 계산
  const complementarityScore = calculateComplementarityScore(modules)
  
  // 3. 시장성 점수 계산
  const marketabilityScore = calculateMarketabilityScore(modules)
  
  // 4. 종합 점수 (가중 평균)
  const overallScore = (
    noveltyScore * 0.3 +
    complementarityScore * 0.4 +
    marketabilityScore * 0.3
  )

  return {
    novelty_score: Math.round(noveltyScore * 100) / 100,
    complementarity_score: Math.round(complementarityScore * 100) / 100,
    marketability_score: Math.round(marketabilityScore * 100) / 100,
    overall_score: Math.round(overallScore * 100) / 100
  }
}

function calculateNoveltyScore(modules: Module[], existingCombinations: any[]): number {
  const currentModuleIds = modules.map(m => m.id).sort()
  
  if (existingCombinations.length === 0) {
    return 5.0 // 첫 번째 조합이면 최고 신선도
  }

  let maxSimilarity = 0
  
  for (const combo of existingCombinations) {
    const comboIds = (combo.module_ids || []).sort()
    const similarity = calculateJaccardSimilarity(currentModuleIds, comboIds)
    maxSimilarity = Math.max(maxSimilarity, similarity)
  }

  // 유사도가 낮을수록 신선도가 높음 (1-5 스케일)
  return Math.max(1, 5 - (maxSimilarity * 4))
}

function calculateComplementarityScore(modules: Module[]): number {
  // 모듈 타입 다양성 점수
  const uniqueTypes = new Set(modules.map(m => m.module_type))
  const diversityScore = Math.min(uniqueTypes.size / 5, 1) // 최대 5개 타입 가정

  // 임베딩 기반 의미적 거리 점수
  let semanticScore = 0
  if (modules.every(m => m.embedding && m.embedding.length > 0)) {
    const embeddings = modules.map(m => m.embedding)
    semanticScore = calculateSemanticComplementarity(embeddings)
  }

  // 품질 점수 기반 시너지
  const avgQuality = modules.reduce((sum, m) => sum + (m.quality_score || 0), 0) / modules.length
  const qualityScore = Math.min(avgQuality / 100, 1) // 0-100을 0-1로 정규화

  return (diversityScore * 0.4 + semanticScore * 0.4 + qualityScore * 0.2) * 5
}

function calculateMarketabilityScore(modules: Module[]): number {
  // 사용량 기반 점수 (검증된 모듈일수록 높은 점수)
  const avgUsage = modules.reduce((sum, m) => sum + (m.usage_count || 0), 0) / modules.length
  const usageScore = Math.min(avgUsage / 10, 1) // 10회 사용을 기준으로 정규화

  // 품질 점수
  const avgQuality = modules.reduce((sum, m) => sum + (m.quality_score || 0), 0) / modules.length
  const qualityScore = Math.min(avgQuality / 100, 1)

  // 모듈 수 보너스 (적절한 모듈 수 조합에 보너스)
  const countBonus = modules.length >= 3 && modules.length <= 7 ? 0.2 : 0

  return ((usageScore * 0.5 + qualityScore * 0.5) + countBonus) * 5
}

function calculateJaccardSimilarity(set1: string[], set2: string[]): number {
  const intersection = set1.filter(x => set2.includes(x))
  const union = [...new Set([...set1, ...set2])]
  
  return union.length === 0 ? 0 : intersection.length / union.length
}

function calculateSemanticComplementarity(embeddings: number[][]): number {
  if (embeddings.length < 2) return 0

  let totalDistance = 0
  let pairCount = 0

  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const distance = cosineSimilarity(embeddings[i], embeddings[j])
      totalDistance += 1 - distance // 거리로 변환 (낮은 유사도 = 높은 상보성)
      pairCount++
    }
  }

  return pairCount > 0 ? totalDistance / pairCount : 0
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}
