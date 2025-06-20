
import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

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
  const [generating, setGenerating] = useState(false);
  const isMobile = useIsMobile();

  const text = {
    ko: {
      todaysPrompt: '오늘의 주제',
      useThisTopic: '이 주제 사용하기',
      noPrompt: '오늘의 주제를 준비중입니다...',
      generating: '새로운 주제 생성 중...',
      generateNew: '새 주제 생성',
      generationSuccess: '새로운 오늘의 주제가 생성되었습니다!',
      generationError: '주제 생성에 실패했습니다. 다시 시도해주세요.',
    },
    en: {
      todaysPrompt: "Today's Topic",
      useThisTopic: 'Use this topic',
      noPrompt: "Today's topic is being prepared...",
      generating: 'Generating new topic...',
      generateNew: 'Generate New Topic',
      generationSuccess: 'New daily topic has been generated!',
      generationError: 'Failed to generate topic. Please try again.',
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

      // If no prompt for today, check if it's more than 2 days old
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

        // If the most recent prompt is more than 1 day old, automatically generate a new one
        if (data && data.date) {
          const promptDate = new Date(data.date);
          const daysDiff = Math.floor((new Date().getTime() - promptDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff >= 1) {
            console.log('Prompt is', daysDiff, 'days old. Attempting to generate new one...');
            generateTodaysPrompt(false); // Silent generation
          }
        }
      }

      setPrompt(data || null);
    } catch (error) {
      console.error('Error fetching daily prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTodaysPrompt = async (showToast = true) => {
    if (showToast) setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-prompt');

      if (error) throw error;

      if (showToast) {
        toast({
          title: text[currentLanguage].generationSuccess,
          duration: 3000,
        });
      }

      // Refresh the prompt after generation
      await fetchTodaysPrompt();
    } catch (error) {
      console.error('Error generating daily prompt:', error);
      if (showToast) {
        toast({
          title: text[currentLanguage].generationError,
          variant: 'destructive',
          duration: 3000,
        });
      }
    } finally {
      if (showToast) setGenerating(false);
    }
  };

  const handleUsePrompt = () => {
    if (prompt) {
      const promptText = currentLanguage === 'ko' ? prompt.prompt_text_ko : prompt.prompt_text_en;
      onUsePrompt(promptText);
    }
  };

  const isOldPrompt = prompt && prompt.date !== new Date().toISOString().split('T')[0];

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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-white">
            <Calendar className="h-4 w-4" />
            <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
              {text[currentLanguage].todaysPrompt}
            </h3>
          </div>
          <Button
            onClick={() => generateTodaysPrompt(true)}
            disabled={generating}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            {generating ? text[currentLanguage].generating : text[currentLanguage].generateNew}
          </Button>
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
    } mb-4 text-white border border-purple-300 ${isOldPrompt ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
            {text[currentLanguage].todaysPrompt}
          </h3>
          {isOldPrompt && (
            <AlertCircle className="h-4 w-4 text-yellow-300" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 animate-pulse" />
          {isOldPrompt && (
            <Button
              onClick={() => generateTodaysPrompt(true)}
              disabled={generating}
              size="sm"
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 border border-yellow-400/30"
            >
              {generating ? text[currentLanguage].generating : text[currentLanguage].generateNew}
            </Button>
          )}
        </div>
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
