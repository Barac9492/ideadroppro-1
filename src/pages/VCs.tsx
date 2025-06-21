
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
            <div className="bg-white rounded-full px-6 py-2">
              <span className="text-2xl">💼</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {text[currentLanguage].title}
          </h1>
          <p className="text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {text[currentLanguage].description}
          </p>
        </div>

        {/* Main VC Profiles Section */}
        <section className="mb-20">
          <VCProfileSystem currentLanguage={currentLanguage} />
        </section>

        {/* Activity Section */}
        <section className="mb-20">
          <VCActivitySection currentLanguage={currentLanguage} />
        </section>

        {/* Dopamine Events Section */}
        <section className="mb-20">
          <VCDopamineEvents 
            currentLanguage={currentLanguage}
            onXPAwarded={(amount) => awardXP(amount, 'VC 상호작용')}
          />
        </section>
      </div>

      {/* Verification Section */}
      <VCVerificationSection currentLanguage={currentLanguage} />
    </div>
  );
};

export default VCs;
