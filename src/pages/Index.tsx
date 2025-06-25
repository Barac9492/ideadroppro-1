
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UltraSimpleHero from '@/components/UltraSimpleHero';
import SimpleTopBar from '@/components/SimpleTopBar';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Simple idea drop handler for main page
  const handleIdeaDrop = async (ideaText: string) => {
    // For main page, we don't need to submit to database
    // Just navigate to builder for analysis
    navigate('/builder', { 
      state: { 
        initialIdea: ideaText,
        autoStart: true 
      } 
    });
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-simple top bar with beta banner */}
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
        showBeta={true}
      />
      
      {/* Add padding for fixed header */}
      <div className="pt-20">
        {/* Ultra-simple hero - this is the main focus */}
        <UltraSimpleHero 
          currentLanguage={currentLanguage}
          onIdeaDrop={handleIdeaDrop}
        />
      </div>
      
      {/* Bottom navigation for mobile, hidden on desktop */}
      <div className={isMobile ? 'block' : 'hidden'}>
        <UnifiedNavigation currentLanguage={currentLanguage} />
      </div>
    </div>
  );
};

export default Index;
