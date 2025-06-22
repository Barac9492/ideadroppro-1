
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Rocket, Lightbulb, Code, Flame, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedIdeaModal from './EnhancedIdeaModal';

interface LandingHeroProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [ideaText, setIdeaText] = useState('');
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '단 몇 초 만에 아이디어를 던지고 AI 피드백을 받으세요. VC의 관심을 끌고, 영향력을 높이며, 리믹스를 통해 협업하세요.',
      placeholder: isMobile 
        ? '당신의 아이디어를 적어보세요...\n\n줄바꿈: Shift+Enter\n제출: Enter\n상세작성: Ctrl+Enter'
        : '당신의 아이디어를 적어보세요...\n\nShift+Enter로 줄바꿈, Enter로 빠른 제출',
      quickSubmit: '빠른 제출',
      enhancedSubmit: '상세 작성',
      explore: '둘러보기',
      trustIndicators: '이미 수천 개의 아이디어가 검증되었습니다',
      howItWorks: '어떻게 작동하나요?',
      step1: '1. Drop: 아이디어 제출',
      step2: '2. AI 분석 & 점수',
      step3: '3. Remix & 협업',
      step4: '4. VC 연결',
      keyboardHint: isMobile ? '터치로 쉽게 작성하세요' : 'Shift+Enter: 줄바꿈 | Enter: 빠른 제출 | Ctrl+Enter: 상세 작성',
      startButton: '시작하기'
    },
    en: {
      title: 'Drop Your Idea, Catch Opportunity',
      subtitle: 'Submit your idea in seconds and get AI feedback. Attract VCs, boost influence, and collaborate through remixes.',
      placeholder: isMobile
        ? 'Write your idea here...\n\nNew line: Shift+Enter\nSubmit: Enter\nDetailed: Ctrl+Enter'
        : 'Write your idea here...\n\nShift+Enter for new line, Enter for quick submit',
      quickSubmit: 'Quick Submit',
      enhancedSubmit: 'Detailed Writing',
      explore: 'Explore',
      trustIndicators: 'Thousands of ideas already validated',
      howItWorks: 'How it works?',
      step1: '1. Drop: Submit idea',
      step2: '2. AI analysis & score',
      step3: '3. Remix & collaborate',
      step4: '4. Connect with VCs',
      keyboardHint: isMobile ? 'Write easily with touch' : 'Shift+Enter: New line | Enter: Quick submit | Ctrl+Enter: Detailed writing',
      startButton: 'Get Started'
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter: Open enhanced modal
        e.preventDefault();
        if (ideaText.trim()) {
          setShowEnhancedModal(true);
        }
      } else if (!e.shiftKey) {
        // Enter (without Shift): Quick submit
        e.preventDefault();
        if (ideaText.trim()) {
          handleQuickSubmit();
        }
      }
      // Shift+Enter: Default behavior (new line)
    }
  };

  const handleQuickSubmit = async () => {
    if (ideaText.trim()) {
      setIsSubmitting(true);
      try {
        await onIdeaDrop(ideaText.trim());
        setIdeaText('');
      } catch (error) {
        console.error('Quick submit error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEnhancedSubmit = async (title: string, fullIdea: string) => {
    setShowEnhancedModal(false);
    setIsSubmitting(true);
    
    try {
      await onIdeaDrop(fullIdea);
      setIdeaText('');
    } catch (error) {
      console.error('Enhanced submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          {/* Main Title */}
          <h1 className={`font-bold text-gray-900 mb-4 md:mb-6 ${
            isMobile ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl lg:text-7xl'
          }`}>
            {text[currentLanguage].title}
          </h1>
          <p className={`text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto ${
            isMobile ? 'text-base px-2' : 'text-lg md:text-xl'
          }`}>
            {text[currentLanguage].subtitle}
          </p>

          {/* Enhanced Input Form - Mobile Optimized */}
          <div className={`w-full mx-auto mb-6 md:mb-8 ${isMobile ? 'px-2' : 'max-w-2xl'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-2 border-purple-100">
              <Textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text[currentLanguage].placeholder}
                className={`w-full border-0 focus:ring-0 resize-none ${
                  isMobile 
                    ? 'min-h-[120px] text-base leading-relaxed' 
                    : 'min-h-[100px] text-lg'
                }`}
                maxLength={500}
                style={{ fontSize: isMobile ? '16px' : undefined }} // Prevent iOS zoom
              />
              
              <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  {text[currentLanguage].keyboardHint}
                </div>
                <div className="text-sm text-gray-500">
                  {ideaText.length}/500
                </div>
              </div>
              
              <div className={`flex gap-2 md:gap-3 mt-3 md:mt-4 ${isMobile ? 'flex-col' : ''}`}>
                <Button
                  onClick={handleQuickSubmit}
                  disabled={!ideaText.trim() || isSubmitting}
                  className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 ${
                    isMobile ? 'flex-1 min-h-[48px] text-base' : 'flex-1'
                  }`}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {text[currentLanguage].quickSubmit}
                </Button>
                
                <Button
                  onClick={() => setShowEnhancedModal(true)}
                  disabled={!ideaText.trim()}
                  variant="outline"
                  className={`border-purple-200 text-purple-700 hover:bg-purple-50 ${
                    isMobile ? 'flex-1 min-h-[48px] text-base' : 'flex-1'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {text[currentLanguage].enhancedSubmit}
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons - Mobile Optimized */}
          <div className={`flex gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 ${
            isMobile ? 'flex-col px-4' : 'flex-col sm:flex-row'
          }`}>
            <Button
              onClick={() => navigate('/submit')}
              size={isMobile ? "default" : "lg"}
              className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 ${
                isMobile ? 'w-full min-h-[48px] text-base px-8 py-3' : 'px-8 py-4 text-lg'
              }`}
            >
              <Rocket className="w-5 h-5 mr-2" />
              {text[currentLanguage].startButton}
            </Button>
            <Button
              onClick={() => navigate('/remix')}
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className={`border-2 ${
                isMobile ? 'w-full min-h-[48px] text-base px-8 py-3' : 'px-8 py-4 text-lg'
              }`}
            >
              {text[currentLanguage].explore}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <p className={`text-gray-500 mb-6 md:mb-8 ${isMobile ? 'text-sm px-4' : 'text-sm'}`}>
            <Sparkles className="inline-block w-4 h-4 mr-1" />
            {text[currentLanguage].trustIndicators}
          </p>
        </div>

        {/* How it Works - Mobile Optimized */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/50 shadow-lg">
          <h3 className={`font-bold text-center text-gray-900 mb-6 md:mb-8 ${
            isMobile ? 'text-xl' : 'text-2xl'
          }`}>
            {text[currentLanguage].howItWorks}
          </h3>
          <div className={`grid gap-4 md:gap-6 ${
            isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'
          }`}>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <p className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : ''}`}>
                {text[currentLanguage].step1}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <p className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : ''}`}>
                {text[currentLanguage].step2}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Code className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <p className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : ''}`}>
                {text[currentLanguage].step3}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <p className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : ''}`}>
                {text[currentLanguage].step4}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Idea Modal */}
      <EnhancedIdeaModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onSubmit={handleEnhancedSubmit}
        initialTitle={ideaText.trim()}
        currentLanguage={currentLanguage}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LandingHero;
