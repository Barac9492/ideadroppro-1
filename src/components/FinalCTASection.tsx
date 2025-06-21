
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinalCTASectionProps {
  currentLanguage: 'ko' | 'en';
  onDropIdea: () => void;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({ currentLanguage, onDropIdea }) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      question: '당신의 아이디어는\n세상에 드러날 준비가 되었나요?',
      description: '피치덱이 되기 전에 먼저 검증받아보세요.',
      mainCTA: '지금 제출하기',
      subCTA: 'AI 분석 + VC 노출',
      secondaryCTA: '오늘 제출된 아이디어 보기',
      stats: {
        today: '오늘',
        ideas: '개 아이디어 제출됨',
        vcs: '명 VC 활동중',
        matches: '건 매칭 성사'
      },
      features: [
        {
          title: '실시간 GPT 분석',
          description: '아이디어를 즉시 분석하고 점수를 제공합니다'
        },
        {
          title: '투자자 피드 노출',
          description: 'VC들이 직접 확인할 수 있는 피드에 등록됩니다'
        },
        {
          title: '커뮤니티 피드백',
          description: '다른 사용자들의 리믹스와 피드백을 받을 수 있습니다'
        }
      ]
    },
    en: {
      question: 'Is your idea ready to be\nrevealed to the world?',
      description: 'Get validated before it becomes a pitch deck.',
      mainCTA: 'Submit Now',
      subCTA: 'AI Analysis + VC Exposure',
      secondaryCTA: 'View Today\'s Submitted Ideas',
      stats: {
        today: 'Today',
        ideas: 'ideas submitted',
        vcs: 'VCs active',
        matches: 'matches made'
      },
      features: [
        {
          title: 'Real-time GPT Analysis',
          description: 'Get instant analysis and scoring of your ideas'
        },
        {
          title: 'Investor Feed Exposure',
          description: 'Your ideas are registered in feeds that VCs check directly'
        },
        {
          title: 'Community Feedback',
          description: 'Receive remixes and feedback from other users'
        }
      ]
    }
  };

  const handleMainCTA = () => {
    navigate('/submit');
  };

  const handleSecondaryClick = () => {
    navigate('/explore');
  };

  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        {/* Live Stats Banner */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 flex items-center space-x-8 text-sm border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{text[currentLanguage].stats.today} 147 {text[currentLanguage].stats.ideas}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>23 {text[currentLanguage].stats.vcs}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>12 {text[currentLanguage].stats.matches}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Main Question */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {text[currentLanguage].question.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line}
              </div>
            ))}
          </h2>
          
          <p className="text-xl text-gray-300 mb-12">
            {text[currentLanguage].description}
          </p>

          {/* Main CTA */}
          <div className="mb-12">
            <Button
              onClick={handleMainCTA}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-16 py-6 text-2xl rounded-2xl shadow-2xl mb-4"
            >
              <Zap className="w-8 h-8 mr-4" />
              {text[currentLanguage].mainCTA}
            </Button>
            
            <div className="text-lg text-gray-400">
              ({text[currentLanguage].subCTA})
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {text[currentLanguage].features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-2xl mb-4">
                  {index === 0 && '🤖'}
                  {index === 1 && '👥'}
                  {index === 2 && '💬'}
                </div>
                <h3 className="font-semibold mb-3 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Secondary CTA */}
          <Button
            onClick={handleSecondaryClick}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl bg-transparent"
          >
            <Users className="w-5 h-5 mr-2" />
            {text[currentLanguage].secondaryCTA}
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-gray-400">
            <Badge className="bg-white/10 text-white border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              실시간 분석
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              투자자 연결
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              커뮤니티 활성
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
