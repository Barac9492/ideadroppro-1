
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SeedIdea } from './types.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function createSupabaseClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

export async function getUserFromAuth(supabaseClient: any, authHeader: string | null) {
  if (!authHeader) {
    console.log('No authorization header provided');
    return { user: null, error: 'Authorization required' };
  }

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    console.log('User error:', userError);
    return { user: null, error: 'Invalid user token' };
  }

  console.log('User authenticated:', user.id);
  return { user, error: null };
}

export async function checkSeedCount(supabaseClient: any) {
  const { data: existingSeed, error: checkError } = await supabaseClient
    .from('ideas')
    .select('id')
    .eq('seed', true);

  if (checkError) {
    console.error('Error checking existing seed data:', checkError);
    throw checkError;
  }

  const currentSeedCount = existingSeed?.length || 0;
  console.log('Current seed count:', currentSeedCount);
  
  return currentSeedCount;
}

export function prepareSeedData(seedIdeas: SeedIdea[], language: 'ko' | 'en', userId: string) {
  return seedIdeas.map(idea => ({
    user_id: userId,
    text: language === 'ko' ? idea.text_ko : idea.text_en,
    score: idea.score,
    tags: language === 'ko' ? idea.tags_ko : idea.tags_en,
    ai_analysis: language === 'ko' ? idea.analysis_ko : idea.analysis_en,
    improvements: language === 'ko' ? idea.improvements_ko : idea.improvements_en,
    market_potential: language === 'ko' ? idea.market_potential_ko : idea.market_potential_en,
    similar_ideas: language === 'ko' ? idea.similar_ideas_ko : idea.similar_ideas_en,
    pitch_points: language === 'ko' ? idea.pitch_points_ko : idea.pitch_points_en,
    seed: true,
    likes_count: Math.floor(Math.random() * 10) + 1
  }));
}

export async function insertSeedData(supabaseClient: any, seedDataToInsert: any[]) {
  console.log('Preparing to insert', seedDataToInsert.length, 'seed ideas');

  const { data, error } = await supabaseClient
    .from('ideas')
    .insert(seedDataToInsert);

  if (error) {
    console.error('Error inserting seed data:', error);
    throw error;
  }

  return data;
}
