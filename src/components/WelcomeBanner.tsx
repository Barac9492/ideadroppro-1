
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface WelcomeBannerProps {
  currentLanguage: 'ko' | 'en';
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      welcome: '아이디어 평가 플랫폼에 오신 것을 환영합니다!',
      description: 'AI와 함께 아이디어를 평가하고 글로벌 시장 분석을 받아보세요',
      guideButton: '사용법 보기',
      aboutButton: '서비스 소개',
      quickStart: '💡 빠른 시작: 아래 텍스트 상자에 아이디어를 입력하고 제출해보세요!'
    },
    en: {
      welcome: 'Welcome to the Idea Evaluation Platform!',
      description: 'Evaluate your ideas with AI and get comprehensive global market analysis',
      guideButton: 'How to Use',
      aboutButton: 'About Us',
      quickStart: '💡 Quick Start: Enter your innovative idea in the text box below and submit it!'
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 md:p-8 mb-8 border border-purple-100 shadow-lg">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          {text[currentLanguage].welcome}
        </h2>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          {text[currentLanguage].description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => navigate('/guide')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg font-semibold px-6 py-3"
            size="lg"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {text[currentLanguage].guideButton}
          </Button>
          
          <Button
            onClick={() => navigate('/about')}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-semibold px-6 py-3"
            size="lg"
          >
            {text[currentLanguage].aboutButton}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
          <p className="text-slate-700 font-medium text-sm leading-relaxed">
            {text[currentLanguage].quickStart}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
