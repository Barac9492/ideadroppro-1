
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Vote, TrendingUp, Users, Zap, Eye, Gift, Clock } from 'lucide-react';

interface SpectatorZoneProps {
  currentLanguage: 'ko' | 'en';
}

const SpectatorZone: React.FC<SpectatorZoneProps> = ({ currentLanguage }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [todayDigestOpen, setTodayDigestOpen] = useState(false);

  const text = {
    ko: {
      title: '관전자 존 - 구경만 해도 재밌다',
      subtitle: '오늘의 트렌드, 대결, 예측을 즐겨보세요',
      gptDigest: 'GPT 트렌드 요약',
      remixBattle: 'Remix 대결',
      investmentPoll: '투자 예상 투표',
      todayTrends: '오늘의 아이디어 트렌드',
      viewDigest: 'GPT 요약 보기',
      voteBest: '베스트 리믹스 투표',
      predictInvestment: '투자 예상하기',
      participants: '참여자',
      reward: '추첨 보상',
      timeLeft: '마감까지',
      battleTitle: '오늘의 리믹스 대결',
      predictionTitle: '내일 투자받을 아이디어는?',
      digestContent: 'AI, 헬스케어, ESG 관련 아이디어가 급증하고 있습니다. 특히 "AI × 전통 산업" 조합이 높은 점수를 받고 있어요.',
      battleIdeas: [
        {
          original: '음성 AI 쇼핑 도우미',
          remix: '시각장애인용 음성 쇼핑 + AR 길안내',
          votes: 127
        },
        {
          original: '폐플라스틱 재활용',
          remix: '동네 팹랩 + NFT 인증서 발급',
          votes: 89
        }
      ],
      predictions: [
        { idea: 'AI 반려동물 건강 모니터링', probability: '73%' },
        { idea: '구독형 친환경 용기 서비스', probability: '68%' },
        { idea: '개인 맞춤 운동 로봇', probability: '82%' }
      ]
    },
    en: {
      title: 'Spectator Zone - Fun Just to Watch',
      subtitle: 'Enjoy today\'s trends, battles, and predictions',
      gptDigest: 'GPT Trend Summary',
      remixBattle: 'Remix Battle',
      investmentPoll: 'Investment Prediction',
      todayTrends: 'Today\'s Idea Trends',
      viewDigest: 'View GPT Summary',
      voteBest: 'Vote Best Remix',
      predictInvestment: 'Predict Investment',
      participants: 'participants',
      reward: 'raffle reward',
      timeLeft: 'time left',
      battleTitle: 'Today\'s Remix Battle',
      predictionTitle: 'Which idea will get investment tomorrow?',
      digestContent: 'AI, healthcare, and ESG-related ideas are surging. Particularly "AI × traditional industry" combinations are receiving high scores.',
      battleIdeas: [
        {
          original: 'Voice AI Shopping Assistant',
          remix: 'Voice Shopping for Blind + AR Navigation',
          votes: 127
        },
        {
          original: 'Plastic Waste Recycling',
          remix: 'Neighborhood FabLab + NFT Certificates',
          votes: 89
        }
      ],
      predictions: [
        { idea: 'AI Pet Health Monitoring', probability: '73%' },
        { idea: 'Subscription Eco Container Service', probability: '68%' },
        { idea: 'Personal Workout Robot', probability: '82%' }
      ]
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Eye className="w-6 h-6 text-indigo-600" />
            <Badge className="bg-indigo-600 text-white px-3 py-1">
              SPECTATOR ZONE
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            👀 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GPT Digest */}
          <Card className="p-6 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {text[currentLanguage].gptDigest}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {text[currentLanguage].todayTrends}
            </p>
            
            {todayDigestOpen && (
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-700">
                  {text[currentLanguage].digestContent}
                </p>
              </div>
            )}
            
            <Button 
              onClick={() => setTodayDigestOpen(!todayDigestOpen)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {text[currentLanguage].viewDigest}
            </Button>

            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <span>📊 실시간 분석</span>
              <span>🔄 1시간마다 업데이트</span>
            </div>
          </Card>

          {/* Remix Battle */}
          <Card className="p-6 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {text[currentLanguage].remixBattle}
              </h3>
            </div>

            <p className="text-gray-600 mb-4 text-sm font-medium">
              {text[currentLanguage].battleTitle}
            </p>

            <div className="space-y-4 mb-4">
              {text[currentLanguage].battleIdeas.map((battle, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">원본: {battle.original}</div>
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    리믹스: {battle.remix}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button size="sm" variant="outline" className="text-xs">
                      투표하기
                    </Button>
                    <Badge className="bg-green-100 text-green-700">
                      {battle.votes} votes
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span><Users className="w-3 h-3 inline mr-1" />342 {text[currentLanguage].participants}</span>
              <span><Clock className="w-3 h-3 inline mr-1" />14:23:45 {text[currentLanguage].timeLeft}</span>
            </div>
          </Card>

          {/* Investment Prediction Poll */}
          <Card className="p-6 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {text[currentLanguage].investmentPoll}
              </h3>
            </div>

            <p className="text-gray-600 mb-4 text-sm font-medium">
              {text[currentLanguage].predictionTitle}
            </p>

            <div className="space-y-3 mb-4">
              {text[currentLanguage].predictions.map((prediction, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedPrediction === prediction.idea 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                  onClick={() => setSelectedPrediction(prediction.idea)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {prediction.idea}
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 text-xs">
                      {prediction.probability}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              disabled={!selectedPrediction}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white disabled:opacity-50"
            >
              <Gift className="w-4 h-4 mr-2" />
              {text[currentLanguage].predictInvestment}
            </Button>

            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <span>🎁 {text[currentLanguage].reward}: GPT 분석 리포트</span>
              <span>🏆 정답률 73%</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpectatorZone;
