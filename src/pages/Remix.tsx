
import React from 'react';
import { useLocation } from 'react-router-dom';
import SimpleTopBar from '@/components/SimpleTopBar';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import RemixStudio from '@/components/RemixStudio';
import { useState } from 'react';

const Remix = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const location = useLocation();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Get initial modules from navigation state
  const initialModules = location.state?.userModules || [];
  const sourceIdea = location.state?.sourceIdea || '';

  return (
    <div className="min-h-screen bg-white">
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="pt-20">
        <UnifiedNavigation currentLanguage={currentLanguage} />
        
        <RemixStudio 
          currentLanguage={currentLanguage}
          initialModules={initialModules}
          sourceIdea={sourceIdea}
        />
      </div>
    </div>
  );
};

export default Remix;
