
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, MessageCircle, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SocialProofSectionProps {
  currentLanguage: 'ko' | 'en';
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '실제 투자자들이 주목하는 아이디어들',
      vcComment: '"우리는 여기서 새로운 트렌드를 먼저 봅니다."',
      vcName: 'Green Ventures 김대표',
      weeklyStats: '지난주 145건 평가, 12건 VC 관심 표시',
      topIdeas: '이번 주 Top 3 아이디어',
      viewAll: '전체 랭킹 보기',
      ideas: [
        {
          title: 'AI 기반 병원 빈자리 실시간 매칭 플랫폼',
          score: 9.2,
          vcInterest: 5,
          category: '헬스케어'
        },
        {
          title: '음성으로 조작하는 스마트홈 IoT 통합 시스템',
          score: 8.8,
          vcInterest: 3,
          category: 'IoT'
        },
        {
          title: '중고차 가격 예측 및 최적 판매시점 알림 서비스',
          score: 8.5,
          vcInterest: 4,
          category: 'AI'
        }
      ]
    },
    en: {
      title: 'Ideas That Real Investors Are Watching',
      vcComment: '"We see new trends here first."',
      vcName: 'CEO Kim, Green Ventures',
      weeklyStats: 'Last week: 145 evaluations, 12 VC interests',
      topIdeas: 'This Week\'s Top 3 Ideas',
      viewAll: 'View Full Rankings',
      ideas: [
        {
          title: 'AI-based Real-time Hospital Vacancy Matching Platform',
          score: 9.2,
          vcInterest: 5,
          category: 'Healthcare'
        },
        {
          title: 'Voice-controlled Smart Home IoT Integration System',
          score: 8.8,
          vcInterest: 3,
          category: 'IoT'
        },
        {
          title: 'Used Car Price Prediction & Optimal Selling Time Alert Service',
          score: 8.5,
          vcInterest: 4,
          category: 'AI'
        }
      ]
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* VC Comment Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-purple-500">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <Badge className="bg-purple-100 text-purple-700 mb-1">💼 Verified VC</Badge>
                <p className="text-sm text-gray-600">{text[currentLanguage].vcName}</p>
              </div>
            </div>
            <blockquote className="text-xl text-gray-800 italic mb-4">
              {text[currentLanguage].vcComment}
            </blockquote>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h3 className="text-lg font-semibold">{text[currentLanguage].weeklyStats}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">145</div>
                  <div className="text-sm opacity-80">평가</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm opacity-80">VC 관심</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-sm opacity-80">활성 VC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Ideas Ranking */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                {text[currentLanguage].topIdeas}
              </h3>
              <Button 
                variant="outline" 
                className="text-purple-600 border-purple-200"
                onClick={() => navigate('/ranking')}
              >
                {text[currentLanguage].viewAll}
              </Button>
            </div>

            <div className="space-y-4">
              {text[currentLanguage].ideas.map((idea, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{idea.title}</h4>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-100 text-blue-700">{idea.category}</Badge>
                        <span className="text-sm text-gray-500">GPT 점수: {idea.score}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-purple-600">
                      <Users className="w-4 h-4" />
                      <span>{idea.vcInterest}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <Zap className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
