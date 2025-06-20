
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DailyPromptLog {
  id: string;
  date: string;
  status: 'success' | 'error' | 'manual';
  error_message?: string;
  created_at: string;
}

interface DailyPromptManagementProps {
  currentLanguage: 'ko' | 'en';
}

const DailyPromptManagement: React.FC<DailyPromptManagementProps> = ({ currentLanguage }) => {
  const [loading, setLoading] = useState(false);
  const [todaysPrompt, setTodaysPrompt] = useState<any>(null);
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [recentLogs, setRecentLogs] = useState<DailyPromptLog[]>([]);

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
      promptExists: '오늘의 주제가 이미 존재합니다',
      recentLogs: '최근 생성 로그',
      status: '상태',
      date: '날짜',
      errorMessage: '오류 메시지',
      successStatus: '성공',
      errorStatus: '오류',
      manualStatus: '수동',
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
      promptExists: 'Today\'s prompt already exists',
      recentLogs: 'Recent Generation Logs',
      status: 'Status',
      date: 'Date',
      errorMessage: 'Error Message',
      successStatus: 'Success',
      errorStatus: 'Error',
      manualStatus: 'Manual',
    }
  };

  useEffect(() => {
    fetchTodaysPrompt();
    fetchRecentLogs();
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

  const fetchRecentLogs = async () => {
    try {
      // Use a raw SQL query to fetch logs from the new table
      const { data, error } = await supabase
        .rpc('get_daily_prompt_logs')
        .limit(10);

      if (error) {
        console.error('Error fetching logs:', error);
        // If the function doesn't exist, create a fallback
        setRecentLogs([]);
      } else {
        setRecentLogs(data || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setRecentLogs([]);
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

      // Refresh data
      await Promise.all([fetchTodaysPrompt(), fetchRecentLogs()]);
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
    await Promise.all([fetchTodaysPrompt(), fetchRecentLogs()]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'manual':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return text[currentLanguage].successStatus;
      case 'error':
        return text[currentLanguage].errorStatus;
      case 'manual':
        return text[currentLanguage].manualStatus;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
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
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>한국어:</strong> {todaysPrompt.prompt_text_ko}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>English:</strong> {todaysPrompt.prompt_text_en}
                </p>
                <p className="text-xs text-gray-400">
                  {text[currentLanguage].date}: {todaysPrompt.date}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">{text[currentLanguage].noPrompt}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{text[currentLanguage].recentLogs}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No logs available</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="text-sm font-medium">{log.date}</p>
                      <p className="text-xs text-gray-500">
                        {getStatusText(log.status)}
                        {log.error_message && ` - ${log.error_message}`}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyPromptManagement;
