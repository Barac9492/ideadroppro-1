
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight, Zap, Users, DollarSign } from 'lucide-react';
import InteractiveIdeaChat from './InteractiveIdeaChat';
import AIInstantFeedback from './AIInstantFeedback';

interface SimplifiedLandingHeroProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string, analysisData?: any) => void;
}

const SimplifiedLandingHero: React.FC<SimplifiedLandingHeroProps> = ({
  currentLanguage,
  onIdeaDrop
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedIdeaData, setCompletedIdeaData] = useState<any>(null);

  const text = {
    ko: {
      mainTitle: '당신의 번뜩이는 아이디어,',
      mainSubtitle: '한 문장으로 던져보세요!',
      placeholder: '예: "비 오는 날 신발 안 젖는 앱 만들고 싶어요"\n"강아지 밥 주는 거 깜빡 안 하는 서비스는 없을까?"',
      startButton: '🚀 AI와 함께 시작하기',
      liveIndicator: '23명의 VC가 지금 활성 상태',
      benefits: [
        '⚡ 30초만에 아이디어 구체화',
        '🤖 AI가 실시간으로 분석',
        '💰 VC 연결 기회 제공'
      ],
      examples: [
        '"배달음식 포장지 재활용 앱"',
        '"AI로 반려동물 건강 체크"',
        '"중고차 실시간 경매 플랫폼"'
      ]
    },
    en: {
      mainTitle: 'Your Brilliant Idea,',
      mainSubtitle: 'Drop it in one sentence!',
      placeholder: 'e.g., "Want to make an app that keeps shoes dry in rain"\n"Is there a service that reminds me to feed my dog?"',
      startButton: '🚀 Start with AI',
      liveIndicator: '23 VCs are currently active',
      benefits: [
        '⚡ Idea development in 30 seconds',
        '🤖 AI analyzes in real-time',
        '💰 VC connection opportunities'
      ],
      examples: [
        '"Food delivery packaging recycling app"',
        '"AI pet health monitoring"',
        '"Real-time used car auction platform"'
      ]
    }
  };

  const handleStart = () => {
    if (ideaText.trim()) {
      setShowChat(true);
    }
  };

  const handleChatComplete = (ideaData: any) => {
    setCompletedIdeaData(ideaData);
    setShowChat(false);
    setShowFeedback(true);
  };

  const handleChatCancel = () => {
    setShowChat(false);
    setIdeaText('');
  };

  const handleFeedbackContinueToRemix = () => {
    setShowFeedback(false);
    // 리믹스 스튜디오로 이동
    onIdeaDrop(completedIdeaData.originalIdea, completedIdeaData);
  };

  const handleFeedbackSubmitToCommunity = () => {
    setShowFeedback(false);
    // 커뮤니티에 직접 제출
    onIdeaDrop(completedIdeaData.originalIdea, completedIdeaData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleStart();
      }
    }
  };

  if (showFeedback && completedIdeaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <AIInstantFeedback
            ideaData={completedIdeaData}
            currentLanguage={currentLanguage}
            onContinueToRemix={handleFeedbackContinueToRemix}
            onSubmitToCommunity={handleFeedbackSubmitToCommunity}
          />
        </div>
      </div>
    );
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <InteractiveIdeaChat
            initialIdea={ideaText}
            currentLanguage={currentLanguage}
            onComplete={handleChatComplete}
            onCancel={handleChatCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center">
      {/* 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6">
        {/* 라이브 VC 상태 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {text[currentLanguage].liveIndicator}
          </div>
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {text[currentLanguage].mainTitle}
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {text[currentLanguage].mainSubtitle}
            </span>
          </h1>

          {/* 혜택 요약 */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {text[currentLanguage].benefits.map((benefit, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700">
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* 메인 입력창 */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl mb-12">
          <CardContent className="p-8">
            <div className="space-y-6">
              <Textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text[currentLanguage].placeholder}
                className="w-full min-h-[120px] text-lg border-0 focus:ring-0 resize-none placeholder-gray-400"
                style={{ fontSize: '18px' }}
                maxLength={200}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {ideaText.length}/200
                </div>
                <Button
                  onClick={handleStart}
                  disabled={!ideaText.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {text[currentLanguage].startButton}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 예시 아이디어 */}
        <div className="text-center">
          <p className="text-gray-600 mb-4 font-medium">
            {currentLanguage === 'ko' ? '💡 이런 아이디어들이 좋아요:' : '💡 Ideas like these work great:'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {text[currentLanguage].examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setIdeaText(example.replace(/"/g, ''))}
                className="bg-white/70 hover:bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-purple-300 rounded-xl px-4 py-2 text-sm text-gray-700 hover:text-purple-700 transition-all duration-200 cursor-pointer"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* 프로세스 미리보기 */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8">
          <div className="flex items-center justify-center gap-8">
            {/* 1단계 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-gray-700">
                {currentLanguage === 'ko' ? '아이디어 입력' : 'Input Idea'}
              </div>
            </div>

            <ArrowRight className="text-gray-400" />

            {/* 2단계 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-gray-700">
                {currentLanguage === 'ko' ? 'AI 구체화' : 'AI Elaborate'}
              </div>
            </div>

            <ArrowRight className="text-gray-400" />

            {/* 3단계 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-gray-700">
                {currentLanguage === 'ko' ? '커뮤니티 평가' : 'Community Review'}
              </div>
            </div>

            <ArrowRight className="text-gray-400" />

            {/* 4단계 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-gray-700">
                {currentLanguage === 'ko' ? 'VC 연결' : 'VC Connection'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedLandingHero;
