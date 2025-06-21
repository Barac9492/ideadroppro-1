
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Rocket, Lightbulb, Code, Flame, Plus } from 'lucide-react';
import IdeaReactionSystem from './IdeaReactionSystem';
import EnhancedIdeaModal from './EnhancedIdeaModal';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [ideaText, setIdeaText] = useState('');
  const [showReactionSystem, setShowReactionSystem] = useState(false);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '단 몇 초 만에 아이디어를 던지고 실시간 피드백을 받으세요. VC의 관심을 끌고, 영향력을 높이며, 리믹스를 통해 아이디어를 발전시키세요.',
      placeholder: '당신의 아이디어를 적어보세요...\n\nShift+Enter로 줄바꿈, Enter로 빠른 제출\nCtrl+Enter로 상세 작성',
      quickSubmit: '빠른 제출',
      enhancedSubmit: '상세 작성',
      trustIndicators: '수천 명의 혁신가들이 이미 아이디어를 던졌습니다.',
      exampleIdeas: '예시 아이디어:',
      example1: 'AI 기반 농업 자동화 플랫폼',
      example2: '탄소 중립 블록체인',
      example3: '스마트 에너지 관리',
      example4: '개인 맞춤형 교육 플랫폼',
      example5: 'AI 기반 헬스케어 솔루션',
      keyboardHint: 'Shift+Enter: 줄바꿈 | Enter: 빠른 제출 | Ctrl+Enter: 상세 작성'
    },
    en: {
      title: 'Drop Your Idea, Catch Opportunity',
      subtitle: 'Drop your idea in seconds and get real-time feedback. Attract VCs, boost influence, and evolve ideas through remixes.',
      placeholder: 'Write your idea here...\n\nShift+Enter for new line, Enter for quick submit\nCtrl+Enter for detailed writing',
      quickSubmit: 'Quick Submit',
      enhancedSubmit: 'Detailed Writing',
      trustIndicators: 'Thousands of innovators have already dropped their ideas.',
      exampleIdeas: 'Example Ideas:',
      example1: 'AI-powered agriculture automation platform',
      example2: 'Carbon-neutral blockchain',
      example3: 'Smart energy management',
      example4: 'Personalized education platform',
      example5: 'AI-driven healthcare solution',
      keyboardHint: 'Shift+Enter: New line | Enter: Quick submit | Ctrl+Enter: Detailed writing'
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
      setSubmittedIdea(ideaText.trim());
      setShowReactionSystem(true);
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
    setSubmittedIdea(fullIdea);
    setShowEnhancedModal(false);
    setShowReactionSystem(true);
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

  const handleReactionComplete = (reactions: any) => {
    console.log('Reactions completed:', reactions);
    setShowReactionSystem(false);
    setSubmittedIdea('');
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
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
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
              <Textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text[currentLanguage].placeholder}
                className="w-full min-h-[120px] border-0 focus:ring-0 text-lg resize-none"
                maxLength={500}
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {text[currentLanguage].keyboardHint}
                </div>
                <div className="text-sm text-gray-500">
                  {ideaText.length}/500
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleQuickSubmit}
                  disabled={!ideaText.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {text[currentLanguage].quickSubmit}
                </Button>
                
                <Button
                  onClick={() => setShowEnhancedModal(true)}
                  disabled={!ideaText.trim()}
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {text[currentLanguage].enhancedSubmit}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Immediate Reaction System */
          <div className="w-full max-w-3xl mx-auto mb-12">
            <Card className="shadow-2xl border-2 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  💫 "{submittedIdea.split('\n')[0]}" 분석 중...
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

export default HeroSection;
