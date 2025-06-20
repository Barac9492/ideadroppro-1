
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, TrendingUp, Lightbulb, Gift } from 'lucide-react';

interface DailyMissionSectionProps {
  currentLanguage: 'ko' | 'en';
}

const DailyMissionSection: React.FC<DailyMissionSectionProps> = ({ currentLanguage }) => {
  const [timeLeft, setTimeLeft] = useState('13:25:33');

  const text = {
    ko: {
      title: '오늘의 GPT 미션',
      subtitle: '매일 바뀌는 특별 키워드로 VC 매칭 확률 UP!',
      todayKeyword: '오늘의 주제',
      keyword: 'AI × 헬스케어',
      missionDesc: '150자 아이디어 작성 시 VC 매칭 확률',
      matchingRate: '73%',
      topIdea: '오늘 이 키워드로 가장 점수 높은 아이디어',
      topScore: '9.2점',
      topExample: '"AI 기반 개인 맞춤형 운동 PT 로봇"',
      timeRemaining: '남은 시간',
      gptHint: 'GPT 힌트 받기',
      tryNow: '지금 도전하기',
      dailyReward: '일일 보상',
      streakBonus: '연속 참여 보너스',
      specialBonus: '키워드 달성 시 VC 노출 우선권'
    },
    en: {
      title: 'Today\'s GPT Mission',
      subtitle: 'Boost VC matching rate with daily special keywords!',
      todayKeyword: 'Today\'s Topic',
      keyword: 'AI × Healthcare',
      missionDesc: 'VC matching rate for 150-char ideas',
      matchingRate: '73%',
      topIdea: 'Highest scoring idea with this keyword today',
      topScore: '9.2 points',
      topExample: '"AI-powered personalized workout PT robot"',
      timeRemaining: 'Time Remaining',
      gptHint: 'Get GPT Hint',
      tryNow: 'Try Now',
      dailyReward: 'Daily Reward',
      streakBonus: 'Streak Bonus',
      specialBonus: 'VC exposure priority for keyword achievement'
    }
  };

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Target className="w-6 h-6 text-orange-600" />
            <Badge className="bg-orange-600 text-white px-3 py-1">
              DAILY MISSION
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎯 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Main Mission Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-orange-200 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Mission Info */}
              <div>
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        🧪 {text[currentLanguage].todayKeyword}
                      </h3>
                      <div className="text-2xl font-bold text-orange-600">
                        {text[currentLanguage].keyword}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{text[currentLanguage].missionDesc}</span>
                      <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                        {text[currentLanguage].matchingRate}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      🏆 {text[currentLanguage].topIdea}: {text[currentLanguage].topScore}
                    </h4>
                    <p className="text-blue-700 italic">
                      {text[currentLanguage].topExample}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timer & Actions */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700 font-medium">
                      {text[currentLanguage].timeRemaining}
                    </span>
                  </div>
                  <div className="text-4xl font-mono font-bold text-red-600 mb-4">
                    {timeLeft}
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{width: '45%'}}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 text-lg"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    {text[currentLanguage].tryNow}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {text[currentLanguage].gptHint}
                  </Button>
                </div>

                {/* Rewards Preview */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="text-yellow-800 font-medium mb-1">
                      {text[currentLanguage].dailyReward}
                    </div>
                    <div className="text-yellow-600">+50 영향력 점수</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-purple-800 font-medium mb-1">
                      {text[currentLanguage].streakBonus}
                    </div>
                    <div className="text-purple-600">3일 연속 시 특별 혜택</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {text[currentLanguage].specialBonus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-orange-600">147</div>
            <div className="text-sm text-gray-600">오늘 참여자</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">VC 관심 표시</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">8.3</div>
            <div className="text-sm text-gray-600">평균 점수</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">매칭 성사</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMissionSection;
