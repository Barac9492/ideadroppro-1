
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HeroText from './HeroText';
import IdeaInputForm from './IdeaInputForm';
import TrustIndicators from './TrustIndicators';
import ExampleIdeas from './ExampleIdeas';
import IdeaReactionSystem from './IdeaReactionSystem';
import EnhancedIdeaModal from './EnhancedIdeaModal';
import ChallengeContextIndicator from './ChallengeContextIndicator';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [showReactionSystem, setShowReactionSystem] = useState(false);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickSubmit = async (ideaText: string) => {
    setSubmittedIdea(ideaText);
    setShowReactionSystem(true);
    setIsSubmitting(true);
    
    try {
      await onIdeaDrop(ideaText);
    } catch (error) {
      console.error('Quick submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnhancedSubmit = async (title: string, fullIdea: string) => {
    setSubmittedIdea(fullIdea);
    setShowEnhancedModal(false);
    setShowReactionSystem(true);
    setIsSubmitting(true);
    
    try {
      await onIdeaDrop(fullIdea);
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
        <HeroText currentLanguage={currentLanguage} />

        {/* Challenge Context Indicator */}
        <div className="w-full max-w-3xl mx-auto mb-4">
          <ChallengeContextIndicator currentLanguage={currentLanguage} />
        </div>

        {/* Main Input Form */}
        {!showReactionSystem ? (
          <IdeaInputForm
            currentLanguage={currentLanguage}
            onQuickSubmit={handleQuickSubmit}
            onEnhancedSubmit={() => setShowEnhancedModal(true)}
            isSubmitting={isSubmitting}
          />
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
        <TrustIndicators currentLanguage={currentLanguage} />

        {/* Example Ideas */}
        <ExampleIdeas currentLanguage={currentLanguage} />
      </div>

      {/* Enhanced Idea Modal */}
      <EnhancedIdeaModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onSubmit={handleEnhancedSubmit}
        initialTitle=""
        currentLanguage={currentLanguage}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default HeroSection;
