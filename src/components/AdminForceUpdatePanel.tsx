
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, RefreshCw, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminForceUpdatePanelProps {
  currentLanguage: 'ko' | 'en';
  onUpdateComplete: () => void;
}

const AdminForceUpdatePanel: React.FC<AdminForceUpdatePanelProps> = ({ 
  currentLanguage, 
  onUpdateComplete 
}) => {
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const text = {
    ko: {
      title: '🚨 관리자 강제 수정 도구',
      description: '모든 0점 아이디어를 강제로 수정합니다. RLS를 우회하여 직접 데이터베이스를 업데이트합니다.',
      warning: '⚠️ 이 도구는 관리자 전용입니다. 모든 0점 아이디어가 강제로 점수를 받게 됩니다.',
      fixAllButton: '🔧 모든 0점 아이디어 강제 수정',
      processing: '수정 중...',
      success: '성공적으로 수정되었습니다!',
      error: '수정 중 오류가 발생했습니다',
      results: '수정 결과',
      updated: '수정된 아이디어',
      total: '전체 아이디어',
      errors: '오류 발생'
    },
    en: {
      title: '🚨 Admin Force Update Tool',
      description: 'Force update all 0-score ideas. Bypasses RLS to directly update the database.',
      warning: '⚠️ This tool is for administrators only. All 0-score ideas will be forcibly scored.',
      fixAllButton: '🔧 Force Fix All 0-Score Ideas',
      processing: 'Processing...',
      success: 'Successfully updated!',
      error: 'Error occurred during update',
      results: 'Update Results',
      updated: 'Updated Ideas',
      total: 'Total Ideas',
      errors: 'Errors'
    }
  };

  const handleForceUpdate = async () => {
    setProcessing(true);
    
    try {
      console.log('🚨 Starting admin force update...');
      
      toast({
        title: text[currentLanguage].processing,
        duration: 2000,
      });

      const { data, error } = await supabase.functions.invoke('admin-force-score-update', {
        body: { 
          action: 'fix_all_zero_scores'
        }
      });

      if (error) {
        console.error('❌ Force update error:', error);
        throw error;
      }

      console.log('✅ Force update result:', data);
      setLastResult(data);

      toast({
        title: `${text[currentLanguage].success} - ${data.updated}개 아이디어 수정됨`,
        duration: 5000,
      });

      // 업데이트 완료 콜백 호출
      onUpdateComplete();

    } catch (error: any) {
      console.error('💥 Force update failed:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message || 'Unknown error',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <Shield className="h-6 w-6" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-sm text-red-700 mb-2">
            {text[currentLanguage].description}
          </p>
          <div className="bg-yellow-100 rounded p-3 mb-4">
            <p className="text-xs text-yellow-800">
              {text[currentLanguage].warning}
            </p>
          </div>
        </div>

        <Button
          onClick={handleForceUpdate}
          disabled={processing}
          className={`w-full text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 ${
            processing 
              ? 'bg-red-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-xl transform hover:scale-105'
          }`}
          size="lg"
        >
          {processing ? (
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>{text[currentLanguage].processing}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5" />
              <span>{text[currentLanguage].fixAllButton}</span>
            </div>
          )}
        </Button>

        {lastResult && (
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold mb-2 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{text[currentLanguage].results}</span>
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600 text-lg">{lastResult.updated}</div>
                <div className="text-gray-600">{text[currentLanguage].updated}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600 text-lg">{lastResult.total}</div>
                <div className="text-gray-600">{text[currentLanguage].total}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-600 text-lg">{lastResult.errors?.length || 0}</div>
                <div className="text-gray-600">{text[currentLanguage].errors}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminForceUpdatePanel;
