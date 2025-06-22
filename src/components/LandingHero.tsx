
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Bot, Users, DollarSign } from 'lucide-react';
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
      title: '간단한 아이디어가 실제 투자로',
      subtitle: 'AI가 구체화하면, 현직 VC가 직접 평가합니다',
      placeholder: '카페 배달 앱 아이디어',
      submitButton: 'VC에게 보여주기',
      liveVCs: '23명의 VC가 지금 활성 상태',
      step1: '아이디어',
      step2: 'AI 구체화',
      step3: 'VC 평가'
    },
    en: {
      title: 'Simple Ideas Become Real Investments',
      subtitle: 'AI elaborates, VCs evaluate directly',
      placeholder: 'Cafe delivery app idea',
      submitButton: 'Show to VCs',
      liveVCs: '23 VCs are currently active',
      step1: 'Your Idea',
      step2: 'AI Elaborate',
      step3: 'VC Review'
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center">
      {/* Simple background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6">
        {/* Live VC Status - Simple */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {text[currentLanguage].liveVCs}
          </div>
        </div>

        {/* Main Title - Clean */}
        <div className="text-center mb-12">
          <h1 className={`font-bold text-gray-900 mb-4 ${
            isMobile ? 'text-3xl' : 'text-5xl'
          }`}>
            {text[currentLanguage].title}
          </h1>
          <p className={`text-gray-600 mb-12 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {text[currentLanguage].subtitle}
          </p>

          {/* Main Input - Centered and Prominent */}
          <div className={`w-full mx-auto mb-12 ${isMobile ? 'max-w-full' : 'max-w-2xl'}`}>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
              <div className="flex flex-col space-y-4">
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={text[currentLanguage].placeholder}
                  className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-xl leading-relaxed font-medium"
                  rows={3}
                  style={{ minHeight: '80px' }}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!ideaText.trim() || isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-lg"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  {text[currentLanguage].submitButton}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Simple 3-Step Process */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className="flex items-center justify-center gap-8">
            {/* Step 1: Idea */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-400 to-gray-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-700">{text[currentLanguage].step1}</div>
            </div>

            {/* Arrow */}
            <div className="text-2xl text-blue-600">→</div>

            {/* Step 2: AI */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-blue-700">{text[currentLanguage].step2}</div>
            </div>

            {/* Arrow */}
            <div className="text-2xl text-green-600">→</div>

            {/* Step 3: VC */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium text-green-700">{text[currentLanguage].step3}</div>
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
