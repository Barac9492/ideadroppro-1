
import React from 'react';
import Header from '@/components/Header';
import GuideHeader from '@/components/GuideHeader';
import GuideSteps from '@/components/GuideSteps';
import GuideFeatures from '@/components/GuideFeatures';
import GuideTips from '@/components/GuideTips';
import GuideCallToAction from '@/components/GuideCallToAction';

const Guide: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en'>('ko');

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <GuideHeader currentLanguage={currentLanguage} />
        <GuideSteps currentLanguage={currentLanguage} />
        <GuideFeatures currentLanguage={currentLanguage} />
        <GuideTips currentLanguage={currentLanguage} />
        <GuideCallToAction currentLanguage={currentLanguage} />
      </div>
    </div>
  );
};

export default Guide;
