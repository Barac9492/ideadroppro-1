
import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Users } from 'lucide-react';
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
      useThisTopic: '이 주제로 아이디어 제출',
      noPrompt: '오늘의 주제를 불러올 수 없습니다.',
    },
    en: {
      todaysPrompt: "Today's Topic",
      useThisTopic: 'Submit idea with this topic',
      noPrompt: "Today's topic is not available.",
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
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPrompt(data);
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
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex items-center space-x-2 text-white mb-4">
          <Calendar className="h-5 w-5" />
          <h3 className="text-lg font-bold">{text[currentLanguage].todaysPrompt}</h3>
        </div>
        <p className="text-white/80 text-sm">{text[currentLanguage].noPrompt}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <h3 className="text-lg font-bold">{text[currentLanguage].todaysPrompt}</h3>
        </div>
        <Sparkles className="h-5 w-5 animate-pulse" />
      </div>
      
      <p className="text-white/90 text-base mb-4 leading-relaxed">
        {currentLanguage === 'ko' ? prompt.prompt_text_ko : prompt.prompt_text_en}
      </p>
      
      <Button
        onClick={handleUsePrompt}
        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 transform hover:scale-105"
      >
        <Users className="h-4 w-4 mr-2" />
        {text[currentLanguage].useThisTopic}
      </Button>
    </div>
  );
};

export default DailyPromptCard;
