
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface GuideCallToActionProps {
  currentLanguage: 'ko' | 'en';
}

const GuideCallToAction: React.FC<GuideCallToActionProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      getStarted: '시작하기',
    },
    en: {
      getStarted: 'Get Started',
    }
  };

  return (
    <div className="text-center mt-8">
      <Button
        onClick={() => navigate('/')}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg px-8 py-3 text-lg"
      >
        {text[currentLanguage].getStarted}
      </Button>
    </div>
  );
};

export default GuideCallToAction;
