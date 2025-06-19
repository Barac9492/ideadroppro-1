
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createSupabaseClient, getUserFromAuth, checkSeedCount, prepareSeedData, insertSeedData } from './utils.ts';
import { seedIdeas } from './seedData.ts';
import { SeedGenerationRequest, SeedGenerationResponse } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createSupabaseClient();
    const authHeader = req.headers.get('Authorization');
    
    // Authenticate user
    const { user, error: authError } = await getUserFromAuth(supabaseClient, authHeader);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: authError || 'Invalid user token' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Parse request body
    const { language = 'ko' }: SeedGenerationRequest = await req.json().catch(() => ({}));
    console.log('Requested language:', language);

    // Check current seed data count (allow up to 10 seed ideas)
    const currentSeedCount = await checkSeedCount(supabaseClient);

    if (currentSeedCount >= 10) {
      console.log('Maximum seed ideas reached (10), skipping generation');
      return new Response(
        JSON.stringify({ message: 'Maximum seed ideas limit reached (10)' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Prepare and insert seed data
    const seedDataToInsert = prepareSeedData(seedIdeas, language, user.id);
    await insertSeedData(supabaseClient, seedDataToInsert);

    console.log(`Successfully generated ${seedIdeas.length} seed ideas in ${language}`);

    const response: SeedGenerationResponse = {
      message: `Successfully generated ${seedIdeas.length} seed ideas`,
      count: seedIdeas.length,
      totalSeedCount: currentSeedCount + seedIdeas.length
    };

    return new Response(
      JSON.stringify(response),
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
