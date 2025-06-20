
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PromptTopic {
  ko: string;
  en: string;
}

const promptTopics: PromptTopic[] = [
  {
    ko: "AI-헬스케어: 인공지능이 의료 분야를 어떻게 혁신할 수 있을까요?",
    en: "AI-Healthcare: How can artificial intelligence revolutionize the medical field?"
  },
  {
    ko: "지속가능한 패션: 환경을 생각하는 새로운 패션 아이디어는?",
    en: "Sustainable Fashion: What are some eco-friendly fashion innovations?"
  },
  {
    ko: "스마트시티: 도시를 더 똑똑하게 만들 수 있는 기술은?",
    en: "Smart Cities: What technologies can make our cities smarter?"
  },
  {
    ko: "원격교육: 온라인 학습을 더 효과적으로 만드는 방법은?",
    en: "Remote Education: How can we make online learning more effective?"
  },
  {
    ko: "푸드테크: 음식과 기술의 융합으로 만들 수 있는 혁신은?",
    en: "Food Tech: What innovations can emerge from combining food and technology?"
  },
  {
    ko: "멘탈헬스: 정신건강을 지키는 새로운 접근법은?",
    en: "Mental Health: What are new approaches to maintaining mental wellness?"
  },
  {
    ko: "클린에너지: 친환경 에너지의 미래는 어떤 모습일까요?",
    en: "Clean Energy: What does the future of renewable energy look like?"
  },
  {
    ko: "가상현실: VR/AR이 일상생활을 어떻게 바꿀 수 있을까요?",
    en: "Virtual Reality: How can VR/AR transform our daily lives?"
  },
  {
    ko: "블록체인: 탈중앙화 기술이 만들어갈 새로운 비즈니스는?",
    en: "Blockchain: What new businesses can decentralized technology create?"
  },
  {
    ko: "로봇공학: 일상에서 활용할 수 있는 로봇 아이디어는?",
    en: "Robotics: What robot ideas can be utilized in daily life?"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current date in KST
    const now = new Date();
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const dateString = kstDate.toISOString().split('T')[0];

    console.log('Generating prompt for date:', dateString);

    // Check if prompt already exists for today
    const { data: existingPrompt } = await supabaseClient
      .from('daily_prompts')
      .select('id')
      .eq('date', dateString)
      .maybeSingle();

    if (existingPrompt) {
      console.log('Prompt already exists for today');
      
      // Log the attempt
      await supabaseClient
        .from('daily_prompt_logs')
        .insert([{
          date: dateString,
          status: 'success',
          error_message: 'Prompt already exists'
        }]);

      return new Response(
        JSON.stringify({ message: 'Prompt already exists for today' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Select a topic based on day of year to ensure variety
    const dayOfYear = Math.floor((kstDate.getTime() - new Date(kstDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const topicIndex = dayOfYear % promptTopics.length;
    const selectedTopic = promptTopics[topicIndex];

    console.log('Selected topic index:', topicIndex, 'Topic:', selectedTopic);

    // Insert new daily prompt
    const { data, error } = await supabaseClient
      .from('daily_prompts')
      .insert([{
        prompt_text_ko: selectedTopic.ko,
        prompt_text_en: selectedTopic.en,
        date: dateString
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting prompt:', error);
      
      // Log the error
      await supabaseClient
        .from('daily_prompt_logs')
        .insert([{
          date: dateString,
          status: 'error',
          error_message: error.message
        }]);
      
      throw error;
    }

    // Log successful creation
    await supabaseClient
      .from('daily_prompt_logs')
      .insert([{
        date: dateString,
        status: 'success'
      }]);

    console.log('Daily prompt generated successfully:', data);

    return new Response(
      JSON.stringify({ 
        message: 'Daily prompt generated successfully',
        prompt: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-daily-prompt function:', error);
    
    // Try to log the error if possible
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const kstDate = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
      const dateString = kstDate.toISOString().split('T')[0];
      
      await supabaseClient
        .from('daily_prompt_logs')
        .insert([{
          date: dateString,
          status: 'error',
          error_message: error.message
        }]);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
