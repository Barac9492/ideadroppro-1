
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface GuideHeaderProps {
  currentLanguage: 'ko' | 'en';
}

const GuideHeader: React.FC<GuideHeaderProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '사용법 가이드',
      subtitle: 'AI 아이디어 평가 서비스 사용 방법',
      backToHome: '홈으로 돌아가기',
    },
    en: {
      title: 'How to Use',
      subtitle: 'Guide to using AI Idea Evaluator',
      backToHome: 'Back to Home',
    }
  };

  return (
    <div className="mb-6">
      <Button
        onClick={() => navigate('/')}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {text[currentLanguage].backToHome}
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
        {text[currentLanguage].title}
      </h1>
      <p className="text-lg text-slate-600">{text[currentLanguage].subtitle}</p>
    </div>
  );
};

export default GuideHeader;
