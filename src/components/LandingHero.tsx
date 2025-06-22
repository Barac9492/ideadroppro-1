
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Bot, Users, Rocket } from 'lucide-react';
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
      title: '간단한 아이디어를 사업화까지',
      subtitle: 'AI가 개선하고, VC가 검증합니다',
      placeholder: '카페 배달 앱',
      submitButton: '아이디어 발전시키기',
      resultPreview: '개선된 사업모델 + 실행계획 + VC 피드백',
      beforeAfter: {
        before: '카페 배달 앱',
        after: '타겟 맞춤형 배달 플랫폼 + 수익모델'
      }
    },
    en: {
      title: 'From Simple Idea to Business Potential',
      subtitle: 'AI improves, VCs validate',
      placeholder: 'Cafe delivery app',
      submitButton: 'Develop Your Idea',
      resultPreview: 'Improved business model + Action plan + VC feedback',
      beforeAfter: {
        before: 'Cafe delivery app',
        after: 'Targeted delivery platform + Revenue model'
      }
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          {/* New USP-focused Title */}
          <h1 className={`font-bold text-gray-900 mb-2 ${
            isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'
          }`}>
            {text[currentLanguage].title}
          </h1>
          <p className={`text-gray-600 mb-8 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {text[currentLanguage].subtitle}
          </p>

          {/* AI Improvement Showcase */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">입력</div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-700">
                    {text[currentLanguage].beforeAfter.before}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Bot className="w-6 h-6 text-blue-600 mb-1" />
                  <div className="text-2xl">→</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">AI 개선</div>
                  <div className="bg-blue-100 border border-blue-200 rounded-lg px-4 py-2 text-blue-800 font-medium">
                    {text[currentLanguage].beforeAfter.after}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Input */}
          <div className={`w-full mx-auto mb-6 ${isMobile ? 'px-2' : 'max-w-2xl'}`}>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-1 flex items-center px-8 py-6">
                  <textarea
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={text[currentLanguage].placeholder}
                    className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-xl leading-relaxed font-medium"
                    rows={1}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {text[currentLanguage].submitButton}
                </Button>
              </div>
            </div>

            {/* Result Preview */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 bg-green-50 rounded-full px-6 py-2 inline-block border border-green-100">
                📈 {text[currentLanguage].resultPreview}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Process: Idea → AI → VC */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className={`flex items-center justify-center gap-4 ${
            isMobile ? 'gap-6' : 'gap-12'
          }`}>
            {/* Step 1: Simple Idea */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-400 to-gray-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-600">간단한 아이디어</div>
            </div>

            {/* Arrow */}
            <div className="text-3xl text-blue-600 font-bold">→</div>

            {/* Step 2: AI Improvement */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                <Bot className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-sm font-medium text-blue-700">AI 개선 & 발전</div>
            </div>

            {/* Arrow */}
            <div className="text-3xl text-blue-600 font-bold">→</div>

            {/* Step 3: VC Review */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-medium text-purple-700">고득점시 VC 검토</div>
            </div>

            {/* Arrow */}
            <div className="text-3xl text-green-600 font-bold">→</div>

            {/* Result: Business Ready */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-medium text-green-700">사업화 준비완료</div>
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
