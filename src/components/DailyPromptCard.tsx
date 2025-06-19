
import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

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
      
      const { data, error } = await supabase
        .from('daily_prompts')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily prompt:', error);
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
      <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl shadow-lg p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl shadow-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-white mb-2">
          <Calendar className="h-4 w-4" />
          <h3 className="text-sm font-semibold">{text[currentLanguage].todaysPrompt}</h3>
        </div>
        <p className="text-white/80 text-xs">{text[currentLanguage].noPrompt}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl shadow-lg p-4 mb-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <h3 className="text-sm font-semibold">{text[currentLanguage].todaysPrompt}</h3>
        </div>
        <Sparkles className="h-4 w-4 animate-pulse" />
      </div>
      
      <p className="text-white/90 text-sm mb-3 leading-relaxed line-clamp-2">
        {currentLanguage === 'ko' ? prompt.prompt_text_ko : prompt.prompt_text_en}
      </p>
      
      <Button
        onClick={handleUsePrompt}
        size="sm"
        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 text-xs"
      >
        {text[currentLanguage].useThisTopic}
      </Button>
    </div>
  );
};

export default DailyPromptCard;
