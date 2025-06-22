
import React, { useState } from 'react';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import IdeaBuilder from '@/components/IdeaBuilder';
import BuilderOnboarding from '@/components/BuilderOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Builder = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Check if user needs onboarding (first time using builder)
  React.useEffect(() => {
    const hasSeenBuilderGuide = localStorage.getItem('hasSeenBuilderGuide');
    if (!hasSeenBuilderGuide) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenBuilderGuide', 'true');
    setShowOnboarding(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SimplifiedHeader 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {/* Desktop navigation at top */}
      {!isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="top"
        />
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <BuilderOnboarding
          currentLanguage={currentLanguage}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Main Builder Interface */}
      <div className="container mx-auto px-4 py-8">
        <IdeaBuilder currentLanguage={currentLanguage} />
      </div>

      {/* Mobile navigation at bottom */}
      {isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="bottom"
        />
      )}
    </div>
  );
};

export default Builder;
