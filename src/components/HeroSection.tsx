import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Rocket, Lightbulb, Code, Flame } from 'lucide-react';
import IdeaReactionSystem from './IdeaReactionSystem';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [ideaText, setIdeaText] = useState('');
  const [showReactionSystem, setShowReactionSystem] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState('');

  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '단 몇 초 만에 아이디어를 던지고 실시간 피드백을 받으세요. VC의 관심을 끌고, 영향력을 높이며, 리믹스를 통해 아이디어를 발전시키세요.',
      placeholder: '당신의 아이디어를 적어보세요...',
      submit: '아이디어 던지기',
      trustIndicators: '수천 명의 혁신가들이 이미 아이디어를 던졌습니다.',
      exampleIdeas: '예시 아이디어:',
      example1: 'AI 기반 농업 자동화 플랫폼',
      example2: '탄소 중립 블록체인',
      example3: '스마트 에너지 관리',
      example4: '개인 맞춤형 교육 플랫폼',
      example5: 'AI 기반 헬스케어 솔루션'
    },
    en: {
      title: 'Drop Your Idea, Catch Opportunity',
      subtitle: 'Drop your idea in seconds and get real-time feedback. Attract VCs, boost influence, and evolve ideas through remixes.',
      placeholder: 'Write your idea here...',
      submit: 'Drop Idea',
      trustIndicators: 'Thousands of innovators have already dropped their ideas.',
      exampleIdeas: 'Example Ideas:',
      example1: 'AI-powered agriculture automation platform',
      example2: 'Carbon-neutral blockchain',
      example3: 'Smart energy management',
      example4: 'Personalized education platform',
      example5: 'AI-driven healthcare solution'
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdeaText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ideaText.trim()) {
      setSubmittedIdea(ideaText.trim());
      setShowReactionSystem(true);
      onIdeaDrop(ideaText.trim());
      setIdeaText('');
    }
  };

  const handleReactionComplete = (reactions: any) => {
    console.log('Reactions completed:', reactions);
    setShowReactionSystem(false);
    setSubmittedIdea('');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Gradient and Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        {/* Header Content */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          {text[currentLanguage].title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          {text[currentLanguage].subtitle}
        </p>

        {/* Main Input Form */}
        {!showReactionSystem ? (
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder={text[currentLanguage].placeholder}
                value={ideaText}
                onChange={handleChange}
                className="w-full rounded-full py-4 px-6 text-lg shadow-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Button
                type="submit"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2 text-lg font-semibold shadow-md transition-colors duration-300"
              >
                {text[currentLanguage].submit}
              </Button>
            </div>
          </form>
        ) : (
          /* Immediate Reaction System */
          <div className="w-full max-w-3xl mx-auto mb-12">
            <Card className="shadow-2xl border-2 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  💫 "{submittedIdea}" 분석 중...
                </h3>
                <IdeaReactionSystem
                  ideaText={submittedIdea}
                  onReactionComplete={handleReactionComplete}
                  currentLanguage={currentLanguage}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <p className="text-sm text-gray-500 mb-4">
          <Sparkles className="inline-block w-4 h-4 mr-1" />
          {text[currentLanguage].trustIndicators}
        </p>

        {/* Example Ideas */}
        <div className="mb-8">
          <h4 className="text-gray-600 font-semibold mb-2">{text[currentLanguage].exampleIdeas}</h4>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Lightbulb className="w-4 h-4 mr-2" />
              {text[currentLanguage].example1}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Code className="w-4 h-4 mr-2" />
              {text[currentLanguage].example2}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Flame className="w-4 h-4 mr-2" />
              {text[currentLanguage].example3}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Rocket className="w-4 h-4 mr-2" />
              {text[currentLanguage].example4}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              {text[currentLanguage].example5}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
