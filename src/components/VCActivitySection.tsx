
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, MessageCircle, Users, TrendingUp, Zap } from 'lucide-react';
import { VC_PROFILES, getVCByIndex } from '@/utils/vcConfig';

interface VCActivitySectionProps {
  currentLanguage: 'ko' | 'en';
}

const VCActivitySection: React.FC<VCActivitySectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '투자자 활동 현황',
      subtitle: 'VC들이 실제로 움직이고 있습니다',
      topVC: '이번 주 Top VC',
      vcActions: 'VC 행동',
      remixes: '개 리믹스',
      comments: '개 코멘트',
      dmRequests: '건 DM 요청',
      curation: '큐레이션',
      viewPicks: '추천 아이디어 보기',
      brandBuilding: 'VC 브랜드 빌딩',
      networkValue: '네트워크 가치 증명'
    },
    en: {
      title: 'VC Activity Status',
      subtitle: 'VCs are actually moving and engaging',
      topVC: 'Top VC This Week',
      vcActions: 'VC Actions',
      remixes: 'remixes',
      comments: 'comments', 
      dmRequests: 'DM requests',
      curation: 'Curation',
      viewPicks: 'View Curated Ideas',
      brandBuilding: 'VC Brand Building',
      networkValue: 'Network Value Proof'
    }
  };

  const vcData = [
    {
      vc: getVCByIndex(0),
      remixes: 23,
      comments: 45,
      dmRequests: 12,
      badge: currentLanguage === 'ko' ? 'Top 리믹서' : 'Top Remixer',
      picks: currentLanguage === 'ko' ? 
        ['AI 농업 자동화', '탄소 중립 블록체인', '스마트 에너지 관리'] :
        ['AI Agriculture Automation', 'Carbon Neutral Blockchain', 'Smart Energy Management']
    },
    {
      vc: getVCByIndex(1),
      remixes: 18,
      comments: 38,
      dmRequests: 15,
      badge: currentLanguage === 'ko' ? '액티브 큐레이터' : 'Active Curator',
      picks: currentLanguage === 'ko' ?
        ['B2B SaaS 확장', '모바일 헬쓰케어', '에듀테크 플랫폼'] :
        ['B2B SaaS Expansion', 'Mobile Healthcare', 'EdTech Platform']
    },
    {
      vc: getVCByIndex(2),
      remixes: 15,
      comments: 29,
      dmRequests: 8,
      badge: currentLanguage === 'ko' ? '얼리 어답터' : 'Early Adopter',
      picks: currentLanguage === 'ko' ?
        ['메타버스 커머스', '로봇 자동화', 'AI 콘텐츠 생성'] :
        ['Metaverse Commerce', 'Robot Automation', 'AI Content Generation']
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-indigo-600 text-white mb-4 px-6 py-2">
              <Crown className="w-4 h-4 mr-2" />
              {text[currentLanguage].vcActions}
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {text[currentLanguage].title}
            </h2>
            <p className="text-xl text-gray-600">
              {text[currentLanguage].subtitle}
            </p>
          </div>

          {/* VC Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {vcData.map((data, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100"
              >
                {/* VC Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {data.vc.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {currentLanguage === 'ko' ? data.vc.name : data.vc.nameEn}
                    </h3>
                    <Badge className="bg-green-100 text-green-700">
                      {data.badge}
                    </Badge>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.remixes}
                    </div>
                    <div className="text-sm text-gray-600">
                      {text[currentLanguage].remixes}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.comments}
                    </div>
                    <div className="text-sm text-gray-600">
                      {text[currentLanguage].comments}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.dmRequests}
                    </div>
                    <div className="text-sm text-gray-600">
                      {text[currentLanguage].dmRequests}
                    </div>
                  </div>
                </div>

                {/* Curated Picks */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {text[currentLanguage].curation}
                  </h4>
                  <div className="space-y-2">
                    {data.picks.slice(0, 2).map((pick, pickIndex) => (
                      <div key={pickIndex} className="text-sm text-gray-700">
                        • {pick}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {text[currentLanguage].viewPicks}
                </Button>
              </div>
            ))}
          </div>

          {/* Network Value Proof */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {text[currentLanguage].networkValue}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {text[currentLanguage].brandBuilding}
                  </h4>
                  <p className="text-sm text-purple-600">
                    {currentLanguage === 'ko' ? 
                      'VC들이 주간 활동 목표를 달성하면 브랜드 배지를 획득하여 가시성을 높일 수 있습니다' :
                      'VCs earn brand badges by achieving weekly activity goals, increasing their visibility'
                    }
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                  <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-green-800 mb-2">
                    Action over Status
                  </h4>
                  <p className="text-sm text-green-600">
                    {currentLanguage === 'ko' ?
                      'VC의 모든 행동(리믹스, 코멘트, DM)이 실시간으로 피드에 표시되어 투명성을 보장합니다' :
                      'All VC actions (remix, comment, DM) are displayed in real-time feed ensuring transparency'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCActivitySection;
