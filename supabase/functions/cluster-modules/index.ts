
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting module clustering process')

    // Fetch all modules with embeddings
    const { data: modules, error: fetchError } = await supabaseClient
      .from('idea_modules')
      .select('id, content, module_type, embedding')
      .not('embedding', 'is', null)

    if (fetchError) throw fetchError

    console.log(`Found ${modules?.length || 0} modules with embeddings`)

    if (!modules || modules.length < 2) {
      return new Response(
        JSON.stringify({ success: true, message: 'Not enough modules for clustering' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Simple clustering based on module type and similarity
    const clusters = await performSimpleClustering(modules)
    
    // Update modules with cluster information
    for (const cluster of clusters) {
      for (const moduleId of cluster.moduleIds) {
        await supabaseClient
          .from('idea_modules')
          .update({ 
            cluster_id: cluster.id, 
            cluster_label: cluster.label 
          })
          .eq('id', moduleId)
      }
    }

    // Update cluster centers table
    for (const cluster of clusters) {
      await supabaseClient
        .from('module_clusters')
        .upsert({
          cluster_id: cluster.id,
          cluster_label: cluster.label,
          center_embedding: cluster.centerEmbedding,
          member_count: cluster.moduleIds.length
        })
    }

    // Calculate and store similarities for top similar pairs
    await calculateTopSimilarities(supabaseClient, modules)

    return new Response(
      JSON.stringify({ 
        success: true, 
        clustersCreated: clusters.length,
        modulesProcessed: modules.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error clustering modules:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function performSimpleClustering(modules: any[]) {
  // Group by module type first (primary clustering)
  const typeGroups: { [key: string]: any[] } = {}
  
  modules.forEach(module => {
    const type = module.module_type
    if (!typeGroups[type]) {
      typeGroups[type] = []
    }
    typeGroups[type].push(module)
  })

  const clusters = []
  let clusterId = 1

  // Create clusters for each module type
  for (const [type, typeModules] of Object.entries(typeGroups)) {
    if (typeModules.length <= 3) {
      // Small groups become single cluster
      clusters.push({
        id: clusterId++,
        label: `${type}_cluster`,
        moduleIds: typeModules.map(m => m.id),
        centerEmbedding: calculateCenterEmbedding(typeModules)
      })
    } else {
      // Large groups get split by similarity
      const subClusters = await splitByEmbeddingSimilarity(typeModules, type)
      subClusters.forEach(cluster => {
        clusters.push({
          id: clusterId++,
          label: cluster.label,
          moduleIds: cluster.moduleIds,
          centerEmbedding: cluster.centerEmbedding
        })
      })
    }
  }

  return clusters
}

async function splitByEmbeddingSimilarity(modules: any[], type: string) {
  // Simple k-means-like clustering
  const maxClusters = Math.min(3, Math.ceil(modules.length / 5))
  const clusters = []

  // Initialize clusters with random seeds
  const seeds = modules.slice(0, maxClusters)
  
  for (let i = 0; i < maxClusters; i++) {
    clusters.push({
      label: `${type}_${i + 1}`,
      moduleIds: [seeds[i].id],
      centerEmbedding: seeds[i].embedding,
      modules: [seeds[i]]
    })
  }

  // Assign remaining modules to closest cluster
  for (let i = maxClusters; i < modules.length; i++) {
    const module = modules[i]
    let bestCluster = 0
    let bestSimilarity = -1

    for (let j = 0; j < clusters.length; j++) {
      const similarity = cosineSimilarity(
        parseEmbedding(module.embedding),
        parseEmbedding(clusters[j].centerEmbedding)
      )
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestCluster = j
      }
    }

    clusters[bestCluster].moduleIds.push(module.id)
    clusters[bestCluster].modules.push(module)
  }

  // Recalculate centers
  clusters.forEach(cluster => {
    cluster.centerEmbedding = calculateCenterEmbedding(cluster.modules)
    delete cluster.modules // Clean up
  })

  return clusters
}

function calculateCenterEmbedding(modules: any[]) {
  if (modules.length === 0) return null
  if (modules.length === 1) return modules[0].embedding

  const embeddings = modules.map(m => parseEmbedding(m.embedding))
  const dimensions = embeddings[0].length
  const center = new Array(dimensions).fill(0)

  embeddings.forEach(embedding => {
    embedding.forEach((val: number, i: number) => {
      center[i] += val
    })
  })

  // Average
  center.forEach((_, i) => {
    center[i] /= embeddings.length
  })

  return `[${center.join(',')}]`
}

function parseEmbedding(embeddingString: string): number[] {
  // Parse "[1,2,3]" format to array
  return JSON.parse(embeddingString)
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function calculateTopSimilarities(supabaseClient: any, modules: any[]) {
  console.log('Calculating top similarities...')
  
  const similarities = []
  
  // Calculate similarities between all pairs (limit to avoid timeout)
  for (let i = 0; i < Math.min(modules.length, 20); i++) {
    for (let j = i + 1; j < Math.min(modules.length, 20); j++) {
      const moduleA = modules[i]
      const moduleB = modules[j]
      
      const similarity = cosineSimilarity(
        parseEmbedding(moduleA.embedding),
        parseEmbedding(moduleB.embedding)
      )
      
      if (similarity > 0.7) { // Only store high similarities
        similarities.push({
          module_a_id: moduleA.id,
          module_b_id: moduleB.id,
          similarity_score: similarity
        })
      }
    }
  }

  if (similarities.length > 0) {
    // Clear existing similarities and insert new ones
    await supabaseClient.from('module_similarities').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    const { error } = await supabaseClient
      .from('module_similarities')
      .insert(similarities)
      
    if (error) {
      console.error('Error inserting similarities:', error)
    } else {
      console.log(`Stored ${similarities.length} similarity pairs`)
    }
  }
}
