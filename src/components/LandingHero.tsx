
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Bot, Users, DollarSign, Loader2 } from 'lucide-react';
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
  const [submissionStep, setSubmissionStep] = useState<'input' | 'analyzing' | 'transitioning'>('input');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const text = {
    ko: {
      title: '간단한 아이디어가 실제 투자로',
      subtitle: 'AI가 구체화하면, 현직 VC가 직접 평가합니다',
      placeholder: '카페 배달 앱 아이디어',
      submitButton: 'AI로 구체화하기',
      analyzing: 'AI가 아이디어를 분석 중입니다...',
      transitioning: 'AI 증강 단계로 이동 중...',
      liveVCs: '23명의 VC가 지금 활성 상태',
      step1: '아이디어 입력',
      step2: 'AI 구체화',
      step3: 'VC 평가',
      currentStep: '현재 단계'
    },
    en: {
      title: 'Simple Ideas Become Real Investments',
      subtitle: 'AI elaborates, VCs evaluate directly',
      placeholder: 'Cafe delivery app idea',
      submitButton: 'Elaborate with AI',
      analyzing: 'AI is analyzing your idea...',
      transitioning: 'Moving to AI enhancement...',
      liveVCs: '23 VCs are currently active',
      step1: 'Enter Idea',
      step2: 'AI Elaborate',
      step3: 'VC Review',
      currentStep: 'Current Step'
    }
  };

  const handleSubmit = async () => {
    if (ideaText.trim()) {
      setIsSubmitting(true);
      setSubmissionStep('analyzing');
      
      // Show analyzing feedback for 1.5 seconds
      setTimeout(() => {
        setSubmissionStep('transitioning');
        
        // Then transition after another 1 second
        setTimeout(async () => {
          try {
            await onIdeaDrop(ideaText.trim());
            setIdeaText('');
          } catch (error) {
            console.error('Submit error:', error);
          } finally {
            setIsSubmitting(false);
            setSubmissionStep('input');
          }
        }, 1000);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim() && !isSubmitting) {
        handleSubmit();
      }
    }
  };

  const getCurrentStepIndex = (): 0 | 1 | 2 => {
    switch (submissionStep) {
      case 'input': return 0;
      case 'analyzing': return 1;
      case 'transitioning': return 1; // Still in AI processing step
      default: return 0;
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

          {/* Submission Status Feedback */}
          {isSubmitting && (
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {submissionStep === 'analyzing' ? text[currentLanguage].analyzing : text[currentLanguage].transitioning}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      "{ideaText.slice(0, 30)}..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Input - Centered and Prominent */}
          {!isSubmitting && (
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
                    disabled={!ideaText.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    {text[currentLanguage].submitButton}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced 3-Step Process with Current Step Highlighting */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className="flex items-center justify-center gap-8">
            {/* Step 1: Idea Input */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                getCurrentStepIndex() === 0 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                  : getCurrentStepIndex() > 0
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
              }`}>
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                getCurrentStepIndex() === 0 ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {text[currentLanguage].step1}
              </div>
              {getCurrentStepIndex() === 0 && (
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  {text[currentLanguage].currentStep}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className={`text-2xl transition-colors duration-300 ${
              getCurrentStepIndex() >= 1 ? 'text-blue-600' : 'text-gray-400'
            }`}>→</div>

            {/* Step 2: AI Enhancement */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                getCurrentStepIndex() === 1 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                  : getCurrentStepIndex() > 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
              }`}>
                {isSubmitting && getCurrentStepIndex() === 1 ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Bot className="w-6 h-6" />
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                getCurrentStepIndex() === 1 ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {text[currentLanguage].step2}
              </div>
              {getCurrentStepIndex() === 1 && (
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  {text[currentLanguage].currentStep}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className={`text-2xl transition-colors duration-300 ${
              getCurrentStepIndex() >= 2 ? 'text-green-600' : 'text-gray-400'
            }`}>→</div>

            {/* Step 3: VC Review */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                getCurrentStepIndex() === 2 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-110' 
                  : 'bg-gray-400 text-white'
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                getCurrentStepIndex() === 2 ? 'text-green-700' : 'text-gray-700'
              }`}>
                {text[currentLanguage].step3}
              </div>
              {getCurrentStepIndex() === 2 && (
                <div className="text-xs text-green-600 mt-1 font-medium">
                  {text[currentLanguage].currentStep}
                </div>
              )}
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
