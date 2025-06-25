
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

    const { moduleId, content, batchProcess = false } = await req.json()

    console.log('Processing embeddings for:', { moduleId, batchProcess })

    if (batchProcess) {
      // Process all modules without embeddings
      const { data: modules, error: fetchError } = await supabaseClient
        .from('idea_modules')
        .select('id, content, module_type')
        .is('embedding', null)
        .limit(50) // Process in batches to avoid timeout

      if (fetchError) throw fetchError

      console.log(`Processing ${modules?.length || 0} modules`)

      for (const module of modules || []) {
        await generateEmbeddingForModule(supabaseClient, module.id, module.content)
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: modules?.length || 0,
          message: `Processed ${modules?.length || 0} modules` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Process single module
      if (!moduleId || !content) {
        throw new Error('moduleId and content are required for single processing')
      }

      await generateEmbeddingForModule(supabaseClient, moduleId, content)

      return new Response(
        JSON.stringify({ success: true, moduleId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error generating embeddings:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateEmbeddingForModule(supabaseClient: any, moduleId: string, content: string) {
  console.log(`Generating embedding for module ${moduleId}`)
  
  const openaiResponse = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: content,
      model: 'text-embedding-3-small',
      dimensions: 1536
    })
  })

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text()
    console.error('OpenAI API error:', errorText)
    throw new Error(`OpenAI API error: ${openaiResponse.status}`)
  }

  const embeddingData = await openaiResponse.json()
  const embedding = embeddingData.data[0].embedding

  // Convert to string format for PostgreSQL vector type
  const embeddingString = `[${embedding.join(',')}]`

  const { error: updateError } = await supabaseClient
    .from('idea_modules')
    .update({ embedding: embeddingString })
    .eq('id', moduleId)

  if (updateError) {
    console.error('Error updating module embedding:', updateError)
    throw updateError
  }

  console.log(`Successfully generated embedding for module ${moduleId}`)
}
