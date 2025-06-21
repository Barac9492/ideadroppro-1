
import React, { useState } from 'react';
import Header from '@/components/Header';
import VCProfileSystem from '@/components/VCProfileSystem';
import VCActivitySection from '@/components/VCActivitySection';
import VCVerificationSection from '@/components/VCVerificationSection';
import VCDopamineEvents from '@/components/VCDopamineEvents';
import { useDailyXP } from '@/hooks/useDailyXP';

const VCs = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { awardXP } = useDailyXP();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💼 {currentLanguage === 'ko' ? 'VC 라운지' : 'VC Lounge'}
          </h1>
          <p className="text-xl text-gray-600">
            {currentLanguage === 'ko' 
              ? '실시간으로 활성화된 투자자들과 연결되세요' 
              : 'Connect with active investors in real-time'
            }
          </p>
        </div>

        <VCProfileSystem currentLanguage={currentLanguage} />

        <div className="mt-16">
          <VCActivitySection currentLanguage={currentLanguage} />
        </div>

        <div className="mt-16">
          <VCDopamineEvents 
            currentLanguage={currentLanguage}
            onXPAwarded={(amount) => awardXP(amount, 'VC 상호작용')}
          />
        </div>
      </div>

      <VCVerificationSection currentLanguage={currentLanguage} />
    </div>
  );
};

export default VCs;
