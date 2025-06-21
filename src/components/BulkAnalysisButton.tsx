
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { useBulkAnalysis } from '@/hooks/useBulkAnalysis';
import { useAuth } from '@/contexts/AuthContext';

interface BulkAnalysisButtonProps {
  currentLanguage: 'ko' | 'en';
  fetchIdeas: () => Promise<void>;
}

const BulkAnalysisButton: React.FC<BulkAnalysisButtonProps> = ({ 
  currentLanguage, 
  fetchIdeas 
}) => {
  const { user } = useAuth();
  const { analyzeUnanalyzedIdeas, analyzing, progress } = useBulkAnalysis({
    currentLanguage,
    user,
    fetchIdeas
  });

  const text = {
    ko: {
      button: '🚨 즉시 점수 수정',
      analyzing: '수정 중... ({current}/{total})',
      description: '모든 0점 아이디어에 즉시 점수를 적용합니다. AI 분석을 시도하고, 실패 시 보장된 점수 시스템을 사용합니다.',
      clickToFix: '클릭하면 즉시 모든 0점 해결',
      emergency: '🚨 강화된 긴급 수정 모드',
      guaranteed: '100% 점수 보장',
      refreshAfter: '완료 후 페이지가 자동 새로고침됩니다',
      powerMode: '💪 강력한 수정 시스템',
      aiFirst: 'AI 우선 + 보장된 백업'
    },
    en: {
      button: '🚨 Fix Scores Now',
      analyzing: 'Fixing... ({current}/{total})',
      description: 'Immediately apply scores to all 0-score ideas. Attempts AI analysis first, then uses guaranteed scoring system as backup.',
      clickToFix: 'Click to fix all 0 scores instantly',
      emergency: '🚨 Enhanced Emergency Fix Mode',
      guaranteed: '100% Score Guaranteed',
      refreshAfter: 'Page will auto-refresh after completion',
      powerMode: '💪 Powerful Fix System',
      aiFirst: 'AI First + Guaranteed Backup'
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 border-2 border-red-400 rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-3">
        <AlertTriangle className="h-7 w-7 text-red-600 animate-pulse" />
        <h3 className="font-bold text-red-800 text-xl">
          {text[currentLanguage].emergency}
        </h3>
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          {text[currentLanguage].guaranteed}
        </span>
      </div>
      
      <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-red-500">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            {text[currentLanguage].powerMode}
          </span>
        </div>
        <p className="text-sm text-red-700 mb-2 leading-relaxed">
          {text[currentLanguage].description}
        </p>
        <div className="bg-blue-50 rounded p-2 mb-2">
          <p className="text-xs text-blue-700 font-medium">
            ✨ {text[currentLanguage].aiFirst}
          </p>
        </div>
        <p className="text-xs text-gray-600">
          {text[currentLanguage].refreshAfter}
        </p>
      </div>
      
      <Button
        onClick={analyzeUnanalyzedIdeas}
        disabled={analyzing}
        className={`w-full text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg ${
          analyzing 
            ? 'bg-red-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 shadow-xl transform hover:scale-105 active:scale-95'
        }`}
        size="lg"
      >
        {analyzing ? (
          <div className="flex items-center space-x-3">
            <Loader className="h-6 w-6 animate-spin" />
            <span>
              {progress.total > 0 
                ? text[currentLanguage].analyzing
                    .replace('{current}', progress.current.toString())
                    .replace('{total}', progress.total.toString())
                : text[currentLanguage].analyzing.replace(' ({current}/{total})', '')
              }
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6" />
            <span>{text[currentLanguage].button}</span>
          </div>
        )}
      </Button>
      
      {!analyzing && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-red-700 font-medium">
            {text[currentLanguage].clickToFix}
          </p>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default BulkAnalysisButton;
