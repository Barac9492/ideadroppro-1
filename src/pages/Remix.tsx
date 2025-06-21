
import React, { useState } from 'react';
import Header from '@/components/Header';
import RemixBattleSystem from '@/components/RemixBattleSystem';
import RemixExplanationSection from '@/components/RemixExplanationSection';
import RemixCommunitySection from '@/components/RemixCommunitySection';
import TopInfluencersBoard from '@/components/TopInfluencersBoard';

const Remix = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧬 {currentLanguage === 'ko' ? '리믹스 전장' : 'Remix Arena'}
          </h1>
          <p className="text-xl text-gray-600">
            {currentLanguage === 'ko' 
              ? '아이디어를 발전시키고 공동 소유권을 획득하세요' 
              : 'Evolve ideas and earn co-ownership rights'
            }
          </p>
        </div>

        <RemixBattleSystem currentLanguage={currentLanguage} />

        <div className="mt-16">
          <TopInfluencersBoard />
        </div>
      </div>

      <RemixExplanationSection currentLanguage={currentLanguage} />
      <RemixCommunitySection currentLanguage={currentLanguage} />
    </div>
  );
};

export default Remix;
