
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader } from 'lucide-react';
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
      button: '0점 아이디어 일괄 분석',
      analyzing: '분석 중... ({current}/{total})'
    },
    en: {
      button: 'Bulk Analyze 0-Score Ideas',
      analyzing: 'Analyzing... ({current}/{total})'
    }
  };

  if (!user) return null;

  return (
    <Button
      onClick={analyzeUnanalyzedIdeas}
      disabled={analyzing}
      variant="outline"
      size="sm"
      className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
    >
      {analyzing ? (
        <div className="flex items-center space-x-2">
          <Loader className="h-4 w-4 animate-spin" />
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
          <Zap className="h-4 w-4" />
          <span>{text[currentLanguage].button}</span>
        </div>
      )}
    </Button>
  );
};

export default BulkAnalysisButton;
