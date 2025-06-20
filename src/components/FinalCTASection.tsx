
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Users, Eye } from 'lucide-react';

interface FinalCTASectionProps {
  currentLanguage: 'ko' | 'en';
  onDropIdea: () => void;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({ currentLanguage, onDropIdea }) => {
  const text = {
    ko: {
      question: '당신의 아이디어는 피치덱이 되기 전,\n세상에 드러날 준비가 되었나요?',
      mainCTA: '지금 드랍하세요',
      subCTA: 'AI 분석 + VC 노출',
      secondaryCTA: '오늘 올라온 모든 아이디어 보기',
      stats: {
        today: '오늘',
        ideas: '개 아이디어 드랍',
        vcs: '명 VC 활동',
        matches: '건 매칭 성사'
      }
    },
    en: {
      question: 'Is your idea ready to be revealed to the world\nbefore it becomes a pitch deck?',
      mainCTA: 'Drop It Now',
      subCTA: 'AI Analysis + VC Exposure',
      secondaryCTA: 'View All Ideas Submitted Today',
      stats: {
        today: 'Today',
        ideas: 'ideas dropped',
        vcs: 'VCs active',
        matches: 'matches made'
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Live Stats Banner */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
          <h2 className="text-3xl md:text-5xl font-bold mb-12 leading-tight">
            📌 {text[currentLanguage].question.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line}
              </div>
            ))}
          </h2>

          {/* Main CTA */}
          <div className="mb-8">
            <Button
              onClick={onDropIdea}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-16 py-6 text-2xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl mb-4"
            >
              <Zap className="w-8 h-8 mr-4" />
              👉 {text[currentLanguage].mainCTA}
            </Button>
            
            <div className="text-lg text-blue-200 mb-8">
              ({text[currentLanguage].subCTA})
            </div>
          </div>

          {/* Secondary CTA */}
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl"
          >
            <Users className="w-5 h-5 mr-2" />
            {text[currentLanguage].secondaryCTA}
          </Button>

          {/* Growth Loop Hints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-2xl mb-3">📩</div>
              <h3 className="font-semibold mb-2">초대 기반 노출</h3>
              <p className="text-sm text-gray-300">
                이 사람을 초대하면 내 아이디어가 상단 노출됩니다
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-2xl mb-3">🔁</div>
              <h3 className="font-semibold mb-2">Daily Streak</h3>
              <p className="text-sm text-gray-300">
                3일 연속 아이디어 드랍 시, 추천 우선순위 부여
              </p>
            </div>
          </div>

          {/* Final Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-blue-200">
            <Badge className="bg-white/10 text-white border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              실시간 GPT 분석
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              투자자 피드 노출
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              커뮤니티 리믹스
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
