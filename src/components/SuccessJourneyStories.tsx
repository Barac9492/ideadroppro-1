
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Rocket, Clock } from 'lucide-react';

interface SuccessStory {
  id: string;
  title: string;
  stage: 'ai_improved' | 'vc_review' | 'investment';
  originalScore: number;
  improvedScore: number;
  likes: number;
  timeframe: string;
  description: string;
  outcome: string;
}

interface SuccessJourneyStoriesProps {
  currentLanguage: 'ko' | 'en';
}

const SuccessJourneyStories: React.FC<SuccessJourneyStoriesProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '실제 성공 여정',
      subtitle: '아이디어가 사업이 되기까지의 실제 사례들',
      stages: {
        ai_improved: 'AI 개선 완료',
        vc_review: 'VC 검토 중',
        investment: '투자 연결'
      },
      scoreImprovement: '점수 향상',
      timeline: '소요 시간',
      likes: '좋아요',
      readMore: '자세히 보기'
    },
    en: {
      title: 'Real Success Journeys',
      subtitle: 'Actual cases of ideas becoming businesses',
      stages: {
        ai_improved: 'AI Enhanced',
        vc_review: 'VC Review',
        investment: 'Investment Connected'
      },
      scoreImprovement: 'Score Improvement',
      timeline: 'Timeline',
      likes: 'Likes',
      readMore: 'Read More'
    }
  };

  const successStories: SuccessStory[] = [
    {
      id: '1',
      title: currentLanguage === 'ko' ? 'AI 반려동물 건강 관리' : 'AI Pet Health Management',
      stage: 'investment',
      originalScore: 6.2,
      improvedScore: 8.7,
      likes: 156,
      timeframe: currentLanguage === 'ko' ? '3주' : '3 weeks',
      description: currentLanguage === 'ko' 
        ? 'AI가 반려동물 사진으로 건강상태를 분석해주는 앱 아이디어. AI 개선 후 수의사 네트워크 연결과 보험 연계 서비스까지 확장.'
        : 'App idea for AI-powered pet health analysis through photos. After AI enhancement, expanded to include veterinary network and insurance integration.',
      outcome: currentLanguage === 'ko' ? '500만원 시드 투자 유치' : '$4K seed investment secured'
    },
    {
      id: '2',
      title: currentLanguage === 'ko' ? '친환경 포장재 배달' : 'Eco-Friendly Packaging Delivery',
      stage: 'vc_review',
      originalScore: 7.1,
      improvedScore: 8.4,
      likes: 89,
      timeframe: currentLanguage === 'ko' ? '2주' : '2 weeks',
      description: currentLanguage === 'ko'
        ? '일회용품 대신 재사용 가능한 포장재로 배달하는 서비스.  리믹스를 통해 포장재 회수 시스템과 리워드 프로그램 추가.'
        : 'Delivery service using reusable packaging instead of disposables. Enhanced through remix with packaging collection system and reward program.',
      outcome: currentLanguage === 'ko' ? '3명의 VC가 관심 표명' : '3 VCs expressed interest'
    },
    {
      id: '3',
      title: currentLanguage === 'ko' ? '소상공인 디지털 전환' : 'SMB Digital Transformation',
      stage: 'ai_improved',
      originalScore: 5.8,
      improvedScore: 8.2,
      likes: 67,
      timeframe: currentLanguage === 'ko' ? '1주' : '1 week',
      description: currentLanguage === 'ko'
        ? '동네 가게들의 온라인 진출을 도와주는 올인원 솔루션. AI 분석으로 맞춤형 마케팅 전략과 고객 관리 시스템 포함.'
        : 'All-in-one solution helping local stores go online. AI analysis included customized marketing strategies and customer management systems.',
      outcome: currentLanguage === 'ko' ? 'VC 검토 대기 중' : 'Awaiting VC review'
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'ai_improved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'vc_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'investment': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'ai_improved': return <TrendingUp className="w-4 h-4" />;
      case 'vc_review': return <Users className="w-4 h-4" />;
      case 'investment': return <Rocket className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {text[currentLanguage].title}
          </h2>
          <p className="text-lg text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {successStories.map((story) => (
            <Card key={story.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-6">
                {/* Stage Badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getStageColor(story.stage)} px-3 py-1`}>
                    {getStageIcon(story.stage)}
                    <span className="ml-1 font-medium">
                      {text[currentLanguage].stages[story.stage]}
                    </span>
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {story.timeframe}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {story.title}
                </h3>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">
                      {text[currentLanguage].scoreImprovement}
                    </div>
                    <div className="font-bold text-blue-600">
                      {story.originalScore} → {story.improvedScore}
                    </div>
                  </div>
                  <div className="text-center bg-red-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">
                      {text[currentLanguage].likes}
                    </div>
                    <div className="font-bold text-red-600">
                      {story.likes}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                  {story.description}
                </p>

                {/* Outcome */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-green-600 font-medium mb-1">결과</div>
                  <div className="text-sm text-green-800 font-semibold">
                    {story.outcome}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessJourneyStories;
