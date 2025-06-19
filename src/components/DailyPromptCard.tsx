
import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface DailyPrompt {
  id: string;
  prompt_text_ko: string;
  prompt_text_en: string;
  date: string;
}

interface DailyPromptCardProps {
  currentLanguage: 'ko' | 'en';
  onUsePrompt: (prompt: string) => void;
}

const DailyPromptCard: React.FC<DailyPromptCardProps> = ({ currentLanguage, onUsePrompt }) => {
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const text = {
    ko: {
      todaysPrompt: '오늘의 주제',
      useThisTopic: '이 주제 사용하기',
      noPrompt: '오늘의 주제를 준비중입니다...',
    },
    en: {
      todaysPrompt: "Today's Topic",
      useThisTopic: 'Use this topic',
      noPrompt: "Today's topic is being prepared...",
    }
  };

  useEffect(() => {
    fetchTodaysPrompt();
  }, []);

  const fetchTodaysPrompt = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // First try to get today's prompt
      let { data, error } = await supabase
        .from('daily_prompts')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily prompt:', error);
      }

      // If no prompt for today, get the most recent one
      if (!data) {
        const { data: recentData, error: recentError } = await supabase
          .from('daily_prompts')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recentError) {
          console.error('Error fetching recent prompt:', recentError);
        }

        data = recentData;
      }

      setPrompt(data || null);
    } catch (error) {
      console.error('Error fetching daily prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsePrompt = () => {
    if (prompt) {
      const promptText = currentLanguage === 'ko' ? prompt.prompt_text_ko : prompt.prompt_text_en;
      onUsePrompt(promptText);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg ${
        isMobile ? 'p-4' : 'p-6'
      } mb-4 border border-purple-300`}>
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className={`bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl shadow-lg ${
        isMobile ? 'p-4' : 'p-6'
      } mb-4 border border-slate-300`}>
        <div className="flex items-center space-x-2 text-white mb-2">
          <Calendar className="h-4 w-4" />
          <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
            {text[currentLanguage].todaysPrompt}
          </h3>
        </div>
        <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {text[currentLanguage].noPrompt}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg ${
      isMobile ? 'p-4' : 'p-6'
    } mb-4 text-white border border-purple-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
            {text[currentLanguage].todaysPrompt}
          </h3>
        </div>
        <Sparkles className="h-4 w-4 animate-pulse" />
      </div>
      
      <p className={`text-white/90 leading-relaxed mb-4 ${
        isMobile ? 'text-sm' : 'text-base'
      } ${isMobile ? 'line-clamp-3' : 'line-clamp-2'}`}>
        {currentLanguage === 'ko' ? prompt.prompt_text_ko : prompt.prompt_text_en}
      </p>
      
      <Button
        onClick={handleUsePrompt}
        size={isMobile ? "sm" : "default"}
        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 shadow-sm backdrop-blur-sm"
      >
        {text[currentLanguage].useThisTopic}
      </Button>
    </div>
  );
};

export default DailyPromptCard;
