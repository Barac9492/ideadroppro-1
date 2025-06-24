
import React from 'react';
import { Button } from '@/components/ui/button';

interface CompletionButtonProps {
  isCompleted: boolean;
  onComplete: () => void;
  currentLanguage: 'ko' | 'en';
}

const CompletionButton: React.FC<CompletionButtonProps> = ({
  isCompleted,
  onComplete,
  currentLanguage
}) => {
  const text = {
    ko: {
      completeButton: '완성! 평가받기'
    },
    en: {
      completeButton: 'Complete! Get Evaluation'
    }
  };

  if (!isCompleted) {
    return null;
  }

  return (
    <div className="p-6 border-t border-gray-100 text-center">
      <Button
        onClick={onComplete}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg font-semibold"
      >
        🎉 {text[currentLanguage].completeButton}
      </Button>
    </div>
  );
};

export default CompletionButton;
