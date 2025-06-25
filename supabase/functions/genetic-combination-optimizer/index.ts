
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Individual {
  modules: string[];
  fitness: number;
  scores?: {
    novelty_score: number;
    complementarity_score: number;
    marketability_score: number;
    overall_score: number;
  };
}

interface GeneticConfig {
  population_size: number;
  generations: number;
  mutation_rate: number;
  crossover_rate: number;
  target_module_count: number;
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

    const { 
      seed_modules = [], 
      target_module_types = [],
      config = {} 
    } = await req.json()

    const defaultConfig: GeneticConfig = {
      population_size: 20,
      generations: 10,
      mutation_rate: 0.1,
      crossover_rate: 0.7,
      target_module_count: 5,
      ...config
    }

    // 사용 가능한 모듈들 가져오기
    let query = supabaseClient
      .from('idea_modules')
      .select('id, module_type, content, embedding, usage_count, quality_score')

    if (target_module_types.length > 0) {
      query = query.in('module_type', target_module_types)
    }

    const { data: availableModules, error } = await query

    if (error) throw error

    if (!availableModules || availableModules.length < defaultConfig.target_module_count) {
      throw new Error('Not enough modules available for optimization')
    }

    const bestCombinations = await runGeneticAlgorithm(
      availableModules,
      seed_modules,
      defaultConfig,
      supabaseClient
    )

    return new Response(
      JSON.stringify({ 
        success: true, 
        best_combinations: bestCombinations,
        config: defaultConfig
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in genetic optimization:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function runGeneticAlgorithm(
  availableModules: any[],
  seedModules: string[],
  config: GeneticConfig,
  supabaseClient: any
): Promise<Individual[]> {
  
  // 1. 초기 population 생성
  let population = generateInitialPopulation(
    availableModules,
    seedModules,
    config
  )

  // 2. 세대별 진화
  for (let generation = 0; generation < config.generations; generation++) {
    // 적합도 평가
    population = await evaluatePopulation(population, supabaseClient)
    
    // 세대 기록 저장
    await saveGenerationRecord(population, generation, config, supabaseClient)
    
    // 다음 세대 생성
    population = await evolvePopulation(population, config, availableModules)
    
    console.log(`Generation ${generation + 1}: Best fitness = ${Math.max(...population.map(p => p.fitness))}`)
  }

  // 최종 평가 및 정렬
  population = await evaluatePopulation(population, supabaseClient)
  population.sort((a, b) => b.fitness - a.fitness)

  return population.slice(0, 5) // 상위 5개 반환
}

function generateInitialPopulation(
  availableModules: any[],
  seedModules: string[],
  config: GeneticConfig
): Individual[] {
  const population: Individual[] = []
  const moduleIds = availableModules.map(m => m.id)
  
  for (let i = 0; i < config.population_size; i++) {
    let modules: string[]
    
    if (seedModules.length > 0 && Math.random() < 0.3) {
      // 30% 확률로 시드 모듈 포함
      modules = [...seedModules]
      const remainingCount = config.target_module_count - seedModules.length
      const remaining = shuffleArray(moduleIds.filter(id => !seedModules.includes(id)))
        .slice(0, Math.max(0, remainingCount))
      modules.push(...remaining)
    } else {
      // 완전 랜덤 조합
      modules = shuffleArray([...moduleIds]).slice(0, config.target_module_count)
    }
    
    population.push({ modules, fitness: 0 })
  }
  
  return population
}

async function evaluatePopulation(
  population: Individual[],
  supabaseClient: any
): Promise<Individual[]> {
  
  for (const individual of population) {
    try {
      // 조합 평가 API 호출
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/evaluate-combination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({ module_ids: individual.modules })
      })
      
      const result = await response.json()
      
      if (result.success) {
        individual.fitness = result.scores.overall_score
        individual.scores = result.scores
      } else {
        individual.fitness = 0
      }
    } catch (error) {
      console.error('Error evaluating individual:', error)
      individual.fitness = 0
    }
  }
  
  return population
}

async function evolvePopulation(
  population: Individual[],
  config: GeneticConfig,
  availableModules: any[]
): Promise<Individual[]> {
  
  const newPopulation: Individual[] = []
  const moduleIds = availableModules.map(m => m.id)
  
  // 엘리트 보존 (상위 10%)
  const eliteCount = Math.floor(config.population_size * 0.1)
  const elite = population.slice(0, eliteCount)
  newPopulation.push(...elite)
  
  // 교배와 변이를 통한 새로운 개체 생성
  while (newPopulation.length < config.population_size) {
    const parent1 = tournamentSelection(population)
    const parent2 = tournamentSelection(population)
    
    let offspring1: Individual, offspring2: Individual
    
    if (Math.random() < config.crossover_rate) {
      [offspring1, offspring2] = crossover(parent1, parent2)
    } else {
      offspring1 = { modules: [...parent1.modules], fitness: 0 }
      offspring2 = { modules: [...parent2.modules], fitness: 0 }
    }
    
    // 변이
    if (Math.random() < config.mutation_rate) {
      offspring1 = mutate(offspring1, moduleIds)
    }
    if (Math.random() < config.mutation_rate) {
      offspring2 = mutate(offspring2, moduleIds)
    }
    
    newPopulation.push(offspring1)
    if (newPopulation.length < config.population_size) {
      newPopulation.push(offspring2)
    }
  }
  
  return newPopulation
}

function tournamentSelection(population: Individual[], tournamentSize: number = 3): Individual {
  const tournament = shuffleArray([...population]).slice(0, tournamentSize)
  return tournament.reduce((best, current) => 
    current.fitness > best.fitness ? current : best
  )
}

function crossover(parent1: Individual, parent2: Individual): [Individual, Individual] {
  const crossoverPoint = Math.floor(Math.random() * Math.min(parent1.modules.length, parent2.modules.length))
  
  const offspring1Modules = [
    ...parent1.modules.slice(0, crossoverPoint),
    ...parent2.modules.slice(crossoverPoint)
  ]
  
  const offspring2Modules = [
    ...parent2.modules.slice(0, crossoverPoint),
    ...parent1.modules.slice(crossoverPoint)
  ]
  
  // 중복 제거
  const offspring1 = {
    modules: [...new Set(offspring1Modules)],
    fitness: 0
  }
  
  const offspring2 = {
    modules: [...new Set(offspring2Modules)],
    fitness: 0
  }
  
  return [offspring1, offspring2]
}

function mutate(individual: Individual, availableModuleIds: string[]): Individual {
  const modules = [...individual.modules]
  const randomIndex = Math.floor(Math.random() * modules.length)
  const availableIds = availableModuleIds.filter(id => !modules.includes(id))
  
  if (availableIds.length > 0) {
    const randomModule = availableIds[Math.floor(Math.random() * availableIds.length)]
    modules[randomIndex] = randomModule
  }
  
  return { modules, fitness: 0 }
}

async function saveGenerationRecord(
  population: Individual[],
  generation: number,
  config: GeneticConfig,
  supabaseClient: any
) {
  const fitnesses = population.map(p => p.fitness)
  const bestFitness = Math.max(...fitnesses)
  const avgFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length
  
  await supabaseClient
    .from('genetic_generations')
    .insert({
      generation_number: generation,
      population_size: config.population_size,
      best_fitness_score: bestFitness,
      average_fitness_score: avgFitness,
      mutation_rate: config.mutation_rate,
      crossover_rate: config.crossover_rate
    })
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
