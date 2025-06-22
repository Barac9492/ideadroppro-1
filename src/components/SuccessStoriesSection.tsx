
import React from 'react';
import { Card } from '@/components/ui/card';

interface SuccessStoriesSectionProps {
  currentLanguage: 'ko' | 'en';
}

const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      stories: [
        {
          emoji: '🐕',
          title: 'AI 반려동물',
          amount: '5억원',
          gradient: 'from-blue-400 to-purple-500'
        },
        {
          emoji: '🌱',
          title: '친환경 배달',
          amount: '12억원',
          gradient: 'from-green-400 to-blue-500'
        },
        {
          emoji: '🚗',
          title: '중고차 경매',
          amount: '8억원',
          gradient: 'from-orange-400 to-red-500'
        }
      ]
    },
    en: {
      stories: [
        {
          emoji: '🐕',
          title: 'AI Pet Care',
          amount: '$400K',
          gradient: 'from-blue-400 to-purple-500'
        },
        {
          emoji: '🌱',
          title: 'Eco Delivery',
          amount: '$950K',
          gradient: 'from-green-400 to-blue-500'
        },
        {
          emoji: '🚗',
          title: 'Car Auction',
          amount: '$650K',
          gradient: 'from-orange-400 to-red-500'
        }
      ]
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {text[currentLanguage].stories.map((story, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-90`}></div>
              <div className="relative p-8 text-center text-white">
                <div className="text-6xl mb-4">{story.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                <div className="text-3xl font-bold">{story.amount}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesSection;
