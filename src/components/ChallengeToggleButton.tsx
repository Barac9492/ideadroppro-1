
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';

interface ChallengeToggleButtonProps {
  currentLanguage: 'ko' | 'en';
  onClick: () => void;
  isVisible: boolean;
}

const ChallengeToggleButton: React.FC<ChallengeToggleButtonProps> = ({
  currentLanguage,
  onClick,
  isVisible
}) => {
  if (!isVisible) return null;

  const text = {
    ko: '오늘의 챌린지',
    en: "Today's Challenge"
  };

  return (
    <div className="fixed top-20 right-4 z-40 animate-bounce">
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-105"
        size="sm"
      >
        <Flame className="w-5 h-5 animate-pulse" />
        <span className="ml-2 hidden md:inline font-semibold">
          {text[currentLanguage]}
        </span>
      </Button>
    </div>
  );
};

export default ChallengeToggleButton;
