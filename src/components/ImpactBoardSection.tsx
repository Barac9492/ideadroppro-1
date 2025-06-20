
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Heart, Repeat, Eye, TrendingUp, Award } from 'lucide-react';

interface ImpactBoardSectionProps {
  currentLanguage: 'ko' | 'en';
}

const ImpactBoardSection: React.FC<ImpactBoardSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '오늘의 임팩트 보드',
      subtitle: '가장 많은 관심을 받은 아이디어들과 활발한 크리에이터들',
      mostLiked: '가장 많은 Like',
      mostRemixed: '가장 많은 Remix',
      vcAttention: 'VC 관심도 1위',
      topCreator: '오늘의 크리에이터',
      likes: '좋아요',
      remixes: '리믹스',
      views: '조회수',
      vcScore: 'VC 점수',
      portfolio: '포트폴리오 보기'
    },
    en: {
      title: 'Today\'s Impact Board',
      subtitle: 'Most engaged ideas and active creators',
      mostLiked: 'Most Liked',
      mostRemixed: 'Most Remixed', 
      vcAttention: '#1 VC Attention',
      topCreator: 'Creator of the Day',
      likes: 'likes',
      remixes: 'remixes',
      views: 'views',
      vcScore: 'VC Score',
      portfolio: 'View Portfolio'
    }
  };

  const mockData = {
    mostLiked: {
      idea: '음성으로 조작하는 시각장애인용 스마트 쇼핑 도우미',
      likes: 127,
      author: 'innovator_kim'
    },
    mostRemixed: {
      idea: '폐플라스틱을 3D프린터 소재로 재활용하는 동네 팹랩',
      remixes: 43,
      author: 'green_maker'
    },
    vcPick: {
      idea: 'AI 기반 맞춤형 반려동물 사료 구독 서비스',
      vcScore: 9.4,
      author: 'pet_entrepreneur'
    },
    topCreator: {
      name: 'future_builder',
      totalLikes: 234,
      totalIdeas: 12,
      totalRemixes: 89,
      badge: '🚀 Rising Star'
    }
  };

  const RankingCard = ({ 
    icon, 
    title, 
    idea, 
    metric, 
    metricLabel, 
    author, 
    rank = 1,
    color = 'purple' 
  }: {
    icon: React.ReactNode;
    title: string;
    idea: string;
    metric: number;
    metricLabel: string;
    author: string;
    rank?: number;
    color?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-500">#{rank}</span>
          </div>
        </div>
        <Badge className={`bg-${color}-100 text-${color}-700 border-${color}-200`}>
          {metric} {metricLabel}
        </Badge>
      </div>
      
      <p className="text-gray-800 mb-4 line-clamp-2 leading-relaxed">
        {idea}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <span className="text-sm text-gray-600">@{author}</span>
        </div>
        <div className={`text-2xl font-bold text-${color}-600`}>
          #{rank}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              IMPACT BOARD
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🏆 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Rankings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <RankingCard
            icon={<Heart className="w-5 h-5 text-white" />}
            title={text[currentLanguage].mostLiked}
            idea={mockData.mostLiked.idea}
            metric={mockData.mostLiked.likes}
            metricLabel={text[currentLanguage].likes}
            author={mockData.mostLiked.author}
            color="red"
          />
          
          <RankingCard
            icon={<Repeat className="w-5 h-5 text-white" />}
            title={text[currentLanguage].mostRemixed}
            idea={mockData.mostRemixed.idea}
            metric={mockData.mostRemixed.remixes}
            metricLabel={text[currentLanguage].remixes}
            author={mockData.mostRemixed.author}
            color="green"
          />
          
          <RankingCard
            icon={<Eye className="w-5 h-5 text-white" />}
            title={text[currentLanguage].vcAttention}
            idea={mockData.vcPick.idea}
            metric={mockData.vcPick.vcScore}
            metricLabel={text[currentLanguage].vcScore}
            author={mockData.vcPick.author}
            color="blue"
          />
        </div>

        {/* Top Creator Spotlight */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {text[currentLanguage].topCreator}
                </h3>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {mockData.topCreator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    @{mockData.topCreator.name}
                  </h4>
                  <p className="text-purple-600 font-medium">
                    {mockData.topCreator.badge}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockData.topCreator.totalLikes}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockData.topCreator.totalIdeas}
                  </div>
                  <div className="text-sm text-gray-600">Ideas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockData.topCreator.totalRemixes}
                  </div>
                  <div className="text-sm text-gray-600">Remixes</div>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="inline-block bg-white rounded-2xl p-6 shadow-lg">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">포트폴리오 효과</h4>
                <p className="text-sm text-gray-600 mb-4">
                  지속적인 아이디어 제출로<br />
                  개인 브랜드 구축 중
                </p>
                <Badge className="bg-purple-100 text-purple-700">
                  Rising Innovator
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactBoardSection;
