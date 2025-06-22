import React from 'react';
import { Users, TrendingUp, Star } from 'lucide-react';

interface MinimalTrustSectionProps {
  currentLanguage: 'ko' | 'en';
}

const MinimalTrustSection: React.FC<MinimalTrustSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      trustLine: '12,000명이 함께하고 있습니다',
      stats: [
        { number: '12,000+', label: '참여자' },
        { number: '156', label: '투자 연결' },
        { number: '4.8', label: '평균 평점' }
      ]
    },
    en: {
      trustLine: '12,000 people are with us',
      stats: [
        { number: '12,000+', label: 'Participants' },
        { number: '156', label: 'Investments' },
        { number: '4.8', label: 'Average Rating' }
      ]
    }
  };

  const icons = [Users, TrendingUp, Star];

  return (
    <div className="py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 font-medium">
            {text[currentLanguage].trustLine}
          </p>
        </div>
        
        <div className="flex justify-center items-center space-x-12">
          {text[currentLanguage].stats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5 text-rose-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinimalTrustSection;
