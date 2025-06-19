
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DailyPromptManagementProps {
  currentLanguage: 'ko' | 'en';
}

const DailyPromptManagement: React.FC<DailyPromptManagementProps> = ({ currentLanguage }) => {
  const [loading, setLoading] = useState(false);
  const [todaysPrompt, setTodaysPrompt] = useState<any>(null);
  const [loadingPrompt, setLoadingPrompt] = useState(true);

  const text = {
    ko: {
      title: '오늘의 주제 관리',
      generateToday: '오늘의 주제 생성',
      refresh: '새로고침',
      generating: '생성 중...',
      refreshing: '새로고침 중...',
      success: '오늘의 주제가 생성되었습니다',
      error: '오류가 발생했습니다',
      todaysPrompt: '현재 오늘의 주제',
      noPrompt: '오늘의 주제가 없습니다',
      promptExists: '오늘의 주제가 이미 존재합니다'
    },
    en: {
      title: 'Daily Prompt Management',
      generateToday: 'Generate Today\'s Prompt',
      refresh: 'Refresh',
      generating: 'Generating...',
      refreshing: 'Refreshing...',
      success: 'Daily prompt has been generated',
      error: 'An error occurred',
      todaysPrompt: 'Current Daily Prompt',
      noPrompt: 'No prompt for today',
      promptExists: 'Today\'s prompt already exists'
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

      setTodaysPrompt(data);
    } catch (error) {
      console.error('Error fetching daily prompt:', error);
    } finally {
      setLoadingPrompt(false);
    }
  };

  const generateTodaysPrompt = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-prompt');

      if (error) throw error;

      toast({
        title: text[currentLanguage].success,
        duration: 3000,
      });

      // Refresh the prompt
      await fetchTodaysPrompt();
    } catch (error) {
      console.error('Error generating daily prompt:', error);
      toast({
        title: text[currentLanguage].error,
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoadingPrompt(true);
    await fetchTodaysPrompt();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={generateTodaysPrompt} 
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{loading ? text[currentLanguage].generating : text[currentLanguage].generateToday}</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={loadingPrompt}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loadingPrompt ? 'animate-spin' : ''}`} />
            <span>{loadingPrompt ? text[currentLanguage].refreshing : text[currentLanguage].refresh}</span>
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">{text[currentLanguage].todaysPrompt}</h3>
          {loadingPrompt ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : todaysPrompt ? (
            <p className="text-sm text-gray-600">
              {currentLanguage === 'ko' ? todaysPrompt.prompt_text_ko : todaysPrompt.prompt_text_en}
            </p>
          ) : (
            <p className="text-sm text-gray-500">{text[currentLanguage].noPrompt}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPromptManagement;
