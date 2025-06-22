
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Lightbulb, Sparkles, Code } from 'lucide-react';
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
      title: '아이디어 제출',
      subtitle: '30초 만에 완료',
      placeholder: '아이디어를 입력하세요',
      startButton: '시작하기',
      explore: '둘러보기'
    },
    en: {
      title: 'Submit Ideas',
      subtitle: 'Complete in 30 seconds',
      placeholder: 'Enter your idea',
      startButton: 'Get Started',
      explore: 'Explore'
    }
  };

  const handleSubmit = async () => {
    if (ideaText.trim()) {
      setIsSubmitting(true);
      try {
        await onIdeaDrop(ideaText.trim());
        setIdeaText('');
      } catch (error) {
        console.error('Submit error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          {/* Ultra-Simple Title */}
          <h1 className={`font-bold text-gray-900 mb-2 ${
            isMobile ? 'text-4xl' : 'text-6xl md:text-7xl'
          }`}>
            {text[currentLanguage].title}
          </h1>
          <p className={`text-gray-600 mb-8 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {text[currentLanguage].subtitle}
          </p>

          {/* Airbnb-Style Search Input */}
          <div className={`w-full mx-auto mb-8 ${isMobile ? 'px-2' : 'max-w-2xl'}`}>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-1 flex items-center px-8 py-6">
                  <textarea
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={text[currentLanguage].placeholder}
                    className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-xl leading-relaxed font-medium"
                    rows={2}
                    style={{ 
                      minHeight: '60px',
                      maxHeight: '120px',
                      overflow: 'hidden'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!ideaText.trim() || isSubmitting}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                  {text[currentLanguage].startButton}
                </Button>
              </div>
            </div>

            {/* Visual benefit indicators */}
            <div className="flex justify-center items-center mt-6 space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">30초 완료</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">즉시 피드백</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">무료 분석</span>
              </div>
            </div>
          </div>

          {/* Simple Action Buttons */}
          <div className={`flex gap-4 justify-center items-center mb-12 ${
            isMobile ? 'flex-col px-4' : 'flex-row'
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
            </Button>
          </div>
        </div>

        {/* Minimal Visual Process - Icons Only */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className={`grid gap-8 ${
            isMobile ? 'grid-cols-2' : 'grid-cols-4'
          }`}>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2</div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Idea Modal */}
      <EnhancedIdeaModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onSubmit={async (title: string, fullIdea: string) => {
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
        }}
        initialTitle={ideaText.trim()}
        currentLanguage={currentLanguage}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LandingHero;
