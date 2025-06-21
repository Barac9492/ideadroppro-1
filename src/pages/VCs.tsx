
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

  const text = {
    ko: {
      title: 'VC 라운지',
      subtitle: '실시간으로 활성화된 투자자들과 연결되세요',
      description: '프라이버시를 보호하면서 투자자들과 안전하게 소통할 수 있습니다'
    },
    en: {
      title: 'VC Lounge',
      subtitle: 'Connect with active investors in real-time',
      description: 'Communicate safely with investors while protecting privacy'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            💼 {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {text[currentLanguage].subtitle}
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            {text[currentLanguage].description}
          </p>
        </div>

        {/* Main VC Profiles Section */}
        <div className="mb-16">
          <VCProfileSystem currentLanguage={currentLanguage} />
        </div>

        {/* Activity Section */}
        <div className="mb-16">
          <VCActivitySection currentLanguage={currentLanguage} />
        </div>

        {/* Dopamine Events Section */}
        <div className="mb-16">
          <VCDopamineEvents 
            currentLanguage={currentLanguage}
            onXPAwarded={(amount) => awardXP(amount, 'VC 상호작용')}
          />
        </div>
      </div>

      {/* Verification Section */}
      <VCVerificationSection currentLanguage={currentLanguage} />
    </div>
  );
};

export default VCs;
