
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { ideaText } = await req.json()
    
    if (!ideaText) {
      return new Response(
        JSON.stringify({ error: 'Idea text is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Create a visual prompt based on the idea
    const visualPrompt = `Create a modern, clean illustration representing this business idea: ${ideaText.substring(0, 200)}. Style: minimalistic, professional, colorful, digital art`

    console.log('Generating image for idea:', ideaText.substring(0, 100) + '...')
    console.log('Visual prompt:', visualPrompt)

    const image = await hf.textToImage({
      inputs: visualPrompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    console.log('Image generated successfully')

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        prompt: visualPrompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
