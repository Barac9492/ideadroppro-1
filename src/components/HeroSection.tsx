
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SimpleHeroText from './SimpleHeroText';
import SimpleIdeaInput from './SimpleIdeaInput';
import MinimalTrustSection from './MinimalTrustSection';
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
    
    try {
      await onIdeaDrop(ideaText);
    } catch (error) {
      console.error('Idea submit error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Clean hero section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Simplified hero text */}
          <SimpleHeroText currentLanguage={currentLanguage} />

          {/* Main input or reaction system */}
          {!showReactionSystem ? (
            <SimpleIdeaInput
              currentLanguage={currentLanguage}
              onSubmit={handleIdeaSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="w-full max-w-3xl mx-auto">
              <Card className="shadow-lg border border-gray-200">
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
        </div>
      </div>

      {/* Minimal trust section at bottom */}
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
