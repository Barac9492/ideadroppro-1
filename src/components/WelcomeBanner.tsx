
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  currentLanguage: 'ko' | 'en';
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      welcome: '처음 방문하셨나요?',
      description: 'AI와 함께 아이디어를 평가하고 글로벌 시장 분석을 받아보세요!',
      guideButton: '사용법 보기',
      aboutButton: '서비스 소개',
      quickStart: '빠른 시작: 아래 텍스트 상자에 아이디어를 입력하고 "아이디어 제출" 버튼을 클릭하세요!'
    },
    en: {
      welcome: 'New to our service?',
      description: 'Evaluate your ideas with AI and get global market analysis!',
      guideButton: 'How to Use',
      aboutButton: 'About Us',
      quickStart: 'Quick Start: Enter your idea in the text box below and click "Submit Idea"!'
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 rounded-3xl p-6 md:p-8 mb-6 border border-purple-200 shadow-lg">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          {text[currentLanguage].welcome}
        </h2>
        
        <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto">
          {text[currentLanguage].description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            onClick={() => navigate('/guide')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
          >
            {text[currentLanguage].guideButton}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => navigate('/about')}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {text[currentLanguage].aboutButton}
          </Button>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-slate-700 font-medium text-sm">
            💡 {text[currentLanguage].quickStart}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
