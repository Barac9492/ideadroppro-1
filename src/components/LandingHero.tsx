
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Zap, BarChart3, Rocket, Users, Award } from 'lucide-react';
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
      title: '현직 VC가 직접 검토하는 아이디어 평가',
      subtitle: '실제 투자 경험으로 평가받세요',
      differentiation: '단순 AI 분석이 아닌, 실제 VC 관점의 전문 평가',
      placeholder: '카페 배달 앱 아이디어를 입력해보세요',
      submitButton: '무료 VC 리뷰 받기',
      resultPreview: '투자가능성 85점, 실제 펀딩 조건, VC 피드백',
      credibility: '12,000+ 아이디어를 검토한 현직 VC진'
    },
    en: {
      title: 'Professional VC Review for Your Ideas',
      subtitle: 'Get evaluated with real investment experience',
      differentiation: 'Not just AI analysis, but actual VC perspective',
      placeholder: 'Enter your cafe delivery app idea',
      submitButton: 'Get Free VC Review',
      resultPreview: 'Investment potential 85pts, Real funding conditions, VC feedback',
      credibility: 'Current VCs who reviewed 12,000+ ideas'
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
          {/* VC-Focused Title */}
          <h1 className={`font-bold text-gray-900 mb-2 ${
            isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'
          }`}>
            {text[currentLanguage].title}
          </h1>
          <p className={`text-gray-600 mb-4 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {text[currentLanguage].subtitle}
          </p>

          {/* VC Credibility */}
          <div className="flex items-center justify-center mb-6">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700 bg-blue-50 px-4 py-2 rounded-full">
              {text[currentLanguage].credibility}
            </span>
          </div>

          {/* Differentiation from ChatGPT */}
          <div className="mb-6">
            <p className="text-base text-gray-700 font-medium bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-3 inline-block">
              💡 {text[currentLanguage].differentiation}
            </p>
          </div>

          {/* VC-Style Search Input */}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                >
                  {text[currentLanguage].submitButton}
                </Button>
              </div>
            </div>

            {/* VC Result Preview */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 bg-blue-50 rounded-full px-6 py-2 inline-block border border-blue-100">
                📊 {text[currentLanguage].resultPreview}
              </p>
            </div>
          </div>
        </div>

        {/* Professional VC Process Flow */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className={`flex items-center justify-center gap-4 ${
            isMobile ? 'gap-2' : 'gap-8'
          }`}>
            {/* Step 1: Professional Idea Review */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                <Lightbulb className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 text-2xl">💼</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-2xl text-gray-400">→</div>

            {/* Step 2: VC Analysis */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                <Users className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 text-2xl">👔</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-2xl text-gray-400">→</div>

            {/* Step 3: Investment Evaluation */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                <BarChart3 className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 text-2xl">💰</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-2xl text-gray-400">→</div>

            {/* Step 4: Funding Ready */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                <Rocket className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 text-2xl">🚀</div>
              </div>
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
