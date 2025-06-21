
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Rocket, Lightbulb, Code, Flame, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LandingHeroProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [ideaText, setIdeaText] = useState('');
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '단 몇 초 만에 아이디어를 던지고 AI 피드백을 받으세요. VC의 관심을 끌고, 영향력을 높이며, 리믹스를 통해 협업하세요.',
      placeholder: '당신의 아이디어를 적어보세요...',
      submit: '아이디어 던지기',
      explore: '둘러보기',
      trustIndicators: '이미 수천 개의 아이디어가 검증되었습니다',
      howItWorks: '어떻게 작동하나요?',
      step1: '1. Drop: 아이디어 제출',
      step2: '2. AI 분석 & 점수',
      step3: '3. Remix & 협업',
      step4: '4. VC 연결',
    },
    en: {
      title: 'Drop Your Idea, Catch Opportunity',
      subtitle: 'Submit your idea in seconds and get AI feedback. Attract VCs, boost influence, and collaborate through remixes.',
      placeholder: 'Write your idea here...',
      submit: 'Drop Idea',
      explore: 'Explore',
      trustIndicators: 'Thousands of ideas already validated',
      howItWorks: 'How it works?',
      step1: '1. Drop: Submit idea',
      step2: '2. AI analysis & score',
      step3: '3. Remix & collaborate',
      step4: '4. Connect with VCs',
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ideaText.trim()) {
      onIdeaDrop(ideaText.trim());
      setIdeaText('');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            {text[currentLanguage].title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>

          {/* Quick Submit Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder={text[currentLanguage].placeholder}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                className="w-full rounded-full py-6 px-6 text-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-32"
              />
              <Button
                type="submit"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-md"
              >
                {text[currentLanguage].submit}
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => navigate('/submit')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              시작하기
            </Button>
            <Button
              onClick={() => navigate('/remix')}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2"
            >
              {text[currentLanguage].explore}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <p className="text-sm text-gray-500 mb-8">
            <Sparkles className="inline-block w-4 h-4 mr-1" />
            {text[currentLanguage].trustIndicators}
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {text[currentLanguage].howItWorks}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800">{text[currentLanguage].step1}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800">{text[currentLanguage].step2}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800">{text[currentLanguage].step3}</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-800">{text[currentLanguage].step4}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
