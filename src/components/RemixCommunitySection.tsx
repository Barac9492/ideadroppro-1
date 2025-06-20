
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Repeat, Users, TrendingUp, Star, Crown, Eye } from 'lucide-react';

interface RemixCommunitySectionProps {
  currentLanguage: 'ko' | 'en';
}

const RemixCommunitySection: React.FC<RemixCommunitySectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '커뮤니티 리믹스 현황',
      subtitle: '실시간으로 아이디어가 진화하고 있습니다',
      featuredIdea: '가장 많이 리믹스된 아이디어',
      ideaText: '배달 음식 포장 쓰레기를 줄이는 구독형 다회용 용기 서비스',
      remixCount: '12명이 리믹스',
      influenceScore: '영향력 점수 400+',
      viewAllRemixes: '모든 리믹스 보기',
      topRemixer: '이번 주 톱 리믹서',
      remixMaster: 'remix_master_kim',
      remixStats: '23개 리믹스 생성'
    },
    en: {
      title: 'Community Remix Status',
      subtitle: 'Ideas are evolving in real-time',
      featuredIdea: 'Most Remixed Idea',
      ideaText: 'Subscription-based reusable container service to reduce food delivery packaging waste',
      remixCount: 'Remixed by 12 people',
      influenceScore: 'Influence Score 400+',
      viewAllRemixes: 'View All Remixes',
      topRemixer: 'Top Remixer This Week',
      remixMaster: 'remix_master_kim',
      remixStats: '23 remixes created'
    }
  };

  const remixExamples = [
    {
      author: 'eco_innovator',
      remix: '+ 블록체인 기반 탄소 크레딧 적립 시스템 추가',
      score: 8.9,
      likes: 34
    },
    {
      author: 'tech_founder',
      remix: '+ IoT 센서로 용기 위치 추적 및 자동 회수',
      score: 9.1,
      likes: 42
    },
    {
      author: 'business_mind',
      remix: '+ 기업 대상 B2B 확장으로 오피스 도시락 시장 진출',
      score: 8.7,
      likes: 28
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-purple-600 text-white px-3 py-1 mb-4">
            REMIX COMMUNITY
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Featured Remix Idea */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4">
                  🔥 {text[currentLanguage].featuredIdea}
                </Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {text[currentLanguage].ideaText}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 mb-1">400+</div>
                <div className="text-sm text-gray-600">영향력 점수</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Repeat className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    {text[currentLanguage].remixCount}
                  </span>
                </div>
                <div className="text-sm text-purple-600">
                  커뮤니티 참여도 극대화
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">
                    {text[currentLanguage].influenceScore}
                  </span>
                </div>
                <div className="text-sm text-green-600">
                  네트워크 효과 발생
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Eye className="w-4 h-4 mr-2" />
                {text[currentLanguage].viewAllRemixes}
              </Button>
            </div>
          </div>
        </div>

        {/* Remix Examples - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {remixExamples.map((remix, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {remix.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    @{remix.author}
                  </span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {remix.score}점
                </Badge>
              </div>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                {remix.remix}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">{remix.likes}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-purple-600 hover:bg-purple-50">
                  <Repeat className="w-3 h-3 mr-1" />
                  리믹스
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Top Remixer Spotlight - Simplified */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  🏆 {text[currentLanguage].topRemixer}
                </h3>
                <div className="text-2xl font-bold">@{text[currentLanguage].remixMaster}</div>
                <div className="text-purple-200">{text[currentLanguage].remixStats}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">856</div>
              <div className="text-purple-200">총 영향력 점수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixCommunitySection;
