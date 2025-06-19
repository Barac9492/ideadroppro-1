
import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Idea {
  id: string;
  finalVerdict?: string;
  seed?: boolean;
}

interface IdeaFinalVerdictProps {
  idea: Idea;
  currentLanguage: 'ko' | 'en';
  isAdmin: boolean;
  isAuthenticated: boolean;
  onSaveFinalVerdict?: (ideaId: string, verdict: string) => void;
}

const IdeaFinalVerdict: React.FC<IdeaFinalVerdictProps> = ({
  idea,
  currentLanguage,
  isAdmin,
  isAuthenticated,
  onSaveFinalVerdict
}) => {
  const [finalVerdict, setFinalVerdict] = useState(idea.finalVerdict || '');
  const [isSavingVerdict, setIsSavingVerdict] = useState(false);

  const text = {
    ko: {
      finalVerdict: 'VC 최종 평가',
      saveVerdict: '평가 저장',
      savingVerdict: '저장 중...',
      verdictPlaceholder: 'VC로서 이 아이디어에 대한 최종 평가를 작성해주세요...'
    },
    en: {
      finalVerdict: 'VC Final Verdict',
      saveVerdict: 'Save Verdict',
      savingVerdict: 'Saving...',
      verdictPlaceholder: 'Write your final verdict on this idea as a VC...'
    }
  };

  const handleSaveVerdict = async () => {
    if (!onSaveFinalVerdict || !finalVerdict.trim()) return;
    
    setIsSavingVerdict(true);
    try {
      await onSaveFinalVerdict(idea.id, finalVerdict.trim());
    } finally {
      setIsSavingVerdict(false);
    }
  };

  // Show existing verdict
  if (idea.finalVerdict) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4 border-l-4 border-yellow-400 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-slate-800">{text[currentLanguage].finalVerdict}</span>
        </div>
        <p className="text-slate-700">{idea.finalVerdict}</p>
      </div>
    );
  }

  // Show admin input form
  if (isAuthenticated && isAdmin && !idea.seed) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4 border-l-4 border-yellow-400 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Award className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-slate-800">{text[currentLanguage].finalVerdict}</span>
        </div>
        <Textarea
          value={finalVerdict}
          onChange={(e) => setFinalVerdict(e.target.value)}
          placeholder={text[currentLanguage].verdictPlaceholder}
          className="mb-3 min-h-[80px] border-yellow-200 focus:border-yellow-400"
        />
        <Button
          onClick={handleSaveVerdict}
          disabled={!finalVerdict.trim() || isSavingVerdict}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 shadow-sm"
        >
          {isSavingVerdict ? text[currentLanguage].savingVerdict : text[currentLanguage].saveVerdict}
        </Button>
      </div>
    );
  }

  return null;
};

export default IdeaFinalVerdict;
