
import React from 'react';
import { Users, TrendingUp, Star } from 'lucide-react';

interface MinimalTrustSectionProps {
  currentLanguage: 'ko' | 'en';
}

const MinimalTrustSection: React.FC<MinimalTrustSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      stats: [
        { number: '12K+', icon: Users, color: 'text-blue-500' },
        { number: '156', icon: TrendingUp, color: 'text-green-500' },
        { number: '4.8', icon: Star, color: 'text-yellow-500' }
      ]
    },
    en: {
      stats: [
        { number: '12K+', icon: Users, color: 'text-blue-500' },
        { number: '156', icon: TrendingUp, color: 'text-green-500' },
        { number: '4.8', icon: Star, color: 'text-yellow-500' }
      ]
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-16">
          {text[currentLanguage].stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <Icon className={`w-8 h-8 ${stat.color} mr-3 group-hover:scale-110 transition-transform`} />
                  <span className="text-4xl font-bold text-gray-900">
                    {stat.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinimalTrustSection;
