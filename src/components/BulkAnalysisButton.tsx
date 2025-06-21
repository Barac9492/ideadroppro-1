
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader, AlertTriangle } from 'lucide-react';
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
      button: '🚨 긴급 점수 수정',
      analyzing: '수정 중... ({current}/{total})',
      description: '모든 0점 아이디어에 즉시 점수를 부여합니다. AI 분석 대신 텍스트 품질 기반으로 점수를 계산합니다.',
      clickToFix: '클릭하여 즉시 수정',
      emergency: '긴급 수정 모드',
      guaranteed: '100% 점수 보장'
    },
    en: {
      button: '🚨 Emergency Score Fix',
      analyzing: 'Fixing... ({current}/{total})',
      description: 'Immediately assign scores to all 0-score ideas. Uses text quality assessment instead of AI analysis.',
      clickToFix: 'Click to fix immediately',
      emergency: 'Emergency Fix Mode',
      guaranteed: '100% Score Guaranteed'
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-3">
        <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
        <h3 className="font-bold text-red-800 text-lg">
          {text[currentLanguage].emergency}
        </h3>
        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {text[currentLanguage].guaranteed}
        </span>
      </div>
      
      <p className="text-sm text-red-700 mb-4 leading-relaxed">
        {text[currentLanguage].description}
      </p>
      
      <Button
        onClick={analyzeUnanalyzedIdeas}
        disabled={analyzing}
        className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ${
          analyzing 
            ? 'bg-red-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg transform hover:scale-105 active:scale-95'
        }`}
        size="lg"
      >
        {analyzing ? (
          <div className="flex items-center space-x-3">
            <Loader className="h-5 w-5 animate-spin" />
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
            <Zap className="h-5 w-5" />
            <span>{text[currentLanguage].button}</span>
          </div>
        )}
      </Button>
      
      {!analyzing && (
        <div className="flex items-center justify-center mt-3 space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-red-600 font-medium">
            {text[currentLanguage].clickToFix}
          </p>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default BulkAnalysisButton;
