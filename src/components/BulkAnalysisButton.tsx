
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader, AlertCircle } from 'lucide-react';
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
      button: '🔧 0점 아이디어 일괄 분석',
      analyzing: '분석 중... ({current}/{total})',
      description: '점수가 0인 아이디어들을 찾아서 AI 분석을 실행합니다',
      clickToFix: '클릭하여 0점 문제 해결'
    },
    en: {
      button: '🔧 Fix 0-Score Ideas',
      analyzing: 'Analyzing... ({current}/{total})',
      description: 'Find and analyze ideas with 0 score using AI',
      clickToFix: 'Click to fix 0-score issues'
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <h3 className="font-semibold text-orange-800">
          {currentLanguage === 'ko' ? '0점 아이디어 문제 해결' : '0-Score Ideas Fix'}
        </h3>
      </div>
      
      <p className="text-sm text-orange-700 mb-3">
        {text[currentLanguage].description}
      </p>
      
      <Button
        onClick={analyzeUnanalyzedIdeas}
        disabled={analyzing}
        className={`w-full ${
          analyzing 
            ? 'bg-orange-400 hover:bg-orange-500' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg transform hover:scale-105 transition-all duration-200'
        } text-white font-semibold`}
      >
        {analyzing ? (
          <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>{text[currentLanguage].button}</span>
          </div>
        )}
      </Button>
      
      {!analyzing && (
        <p className="text-xs text-orange-600 mt-2 text-center">
          {text[currentLanguage].clickToFix}
        </p>
      )}
    </div>
  );
};

export default BulkAnalysisButton;
