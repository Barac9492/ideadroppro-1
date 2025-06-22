
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Zap } from 'lucide-react';

interface SuccessStoriesSectionProps {
  currentLanguage: 'ko' | 'en';
}

const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '성공 사례',
      subtitle: '이미 많은 혁신가들이 기회를 잡았습니다',
      stories: [
        {
          title: 'AI 반려동물 케어',
          description: '펫케어 스타트업으로 시드 투자 유치',
          amount: '5억원',
          category: 'AI·펫테크',
          icon: '🐕'
        },
        {
          title: '친환경 배달 서비스',
          description: '배달업계 ESG 혁신으로 주목',
          amount: '12억원',
          category: '환경·물류',
          icon: '🌱'
        },
        {
          title: '중고차 경매 플랫폼',
          description: '차량 거래의 새로운 패러다임 제시',
          amount: '8억원',
          category: '모빌리티',
          icon: '🚗'
        }
      ]
    },
    en: {
      title: 'Success Stories',
      subtitle: 'Many innovators have already seized opportunities',
      stories: [
        {
          title: 'AI Pet Care Service',
          description: 'Secured seed funding for pet care startup',
          amount: '$400K',
          category: 'AI·PetTech',
          icon: '🐕'
        },
        {
          title: 'Eco-Friendly Delivery',
          description: 'Revolutionizing delivery industry ESG',
          amount: '$950K',
          category: 'Green·Logistics',
          icon: '🌱'
        },
        {
          title: 'Used Car Auction',
          description: 'New paradigm for vehicle trading',
          amount: '$650K',
          category: 'Mobility',
          icon: '🚗'
        }
      ]
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h2>
          <p className="text-lg text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {text[currentLanguage].stories.map((story, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{story.icon}</div>
                  <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                    {story.category}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {story.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{story.amount}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Zap className="w-4 h-4 mr-1" />
                    투자 유치
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesSection;
