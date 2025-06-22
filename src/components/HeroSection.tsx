
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SimpleHeroText from './SimpleHeroText';
import AirbnbStyleInput from './AirbnbStyleInput';
import MinimalTrustSection from './MinimalTrustSection';
import SuccessStoriesSection from './SuccessStoriesSection';
import IdeaReactionSystem from './IdeaReactionSystem';
import EnhancedIdeaModal from './EnhancedIdeaModal';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [showReactionSystem, setShowReactionSystem] = useState(false);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIdeaSubmit = async (ideaText: string) => {
    setSubmittedIdea(ideaText);
    setShowReactionSystem(true);
    setIsSubmitting(true);
    
    // Show immediate feedback before processing
    setTimeout(async () => {
      try {
        await onIdeaDrop(ideaText);
      } catch (error) {
        console.error('Idea submit error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const handleReactionComplete = (reactions: any) => {
    console.log('Reactions completed:', reactions);
    setShowReactionSystem(false);
    setSubmittedIdea('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with ultra-clean layout */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Ultra-simplified hero text */}
          <SimpleHeroText currentLanguage={currentLanguage} />

          {/* Large centered search or reaction system */}
          {!showReactionSystem ? (
            <AirbnbStyleInput
              currentLanguage={currentLanguage}
              onSubmit={handleIdeaSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="w-full max-w-5xl mx-auto">
              <Card className="shadow-2xl border-0 rounded-3xl">
                <CardContent className="p-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
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

          {/* Visual service explanation */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-4 rounded-full">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {currentLanguage === 'ko' ? 'AI가 실시간으로 분석합니다' : 'AI analyzes in real-time'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual-first success stories */}
      <SuccessStoriesSection currentLanguage={currentLanguage} />

      {/* Minimal icon-only trust indicators */}
      <MinimalTrustSection currentLanguage={currentLanguage} />

      {/* Enhanced Idea Modal */}
      <EnhancedIdeaModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onSubmit={(title: string, fullIdea: string) => handleIdeaSubmit(fullIdea)}
        initialTitle=""
        currentLanguage={currentLanguage}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default HeroSection;
