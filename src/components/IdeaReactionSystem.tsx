
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Users, TrendingUp, Zap, Target, Clock } from 'lucide-react';

interface IdeaReactionSystemProps {
  ideaText: string;
  onReactionComplete: (reactions: any) => void;
  currentLanguage: 'ko' | 'en';
}

const IdeaReactionSystem: React.FC<IdeaReactionSystemProps> = ({
  ideaText,
  onReactionComplete,
  currentLanguage
}) => {
  const [reactions, setReactions] = useState({
    gptPrediction: 0,
    vcInterest: 0,
    similarIdeas: 0,
    remixSuggestions: [],
    competitorCount: 0,
    marketSize: '',
    urgencyScore: 0
  });
  const [showPredictionGame, setShowPredictionGame] = useState(true);
  const [userPrediction, setUserPrediction] = useState(7.5);
  const [processing, setProcessing] = useState(true);

  const text = {
    ko: {
      predicting: 'GPT가 분석 중...',
      vcChecking: 'VC들이 확인 중...',
      findingSimilar: '유사 아이디어 검색 중...',
      competitor: '명이 동시에 작성 중',
      predictScore: '점수 예측 게임',
      yourPrediction: '예상 점수',
      submit: '예측 제출',
      actualScore: '실제 점수',
      bonus: '예측 보너스',
      vcEyes: '명의 VC가 주목',
      marketOpportunity: '시장 기회',
      remixReady: '리믹스 준비됨'
    },
    en: {
      predicting: 'GPT analyzing...',
      vcChecking: 'VCs checking...',
      findingSimilar: 'Finding similar ideas...',
      competitor: 'others writing simultaneously',
      predictScore: 'Score Prediction Game',
      yourPrediction: 'Your Prediction',
      submit: 'Submit Prediction',
      actualScore: 'Actual Score',
      bonus: 'Prediction Bonus',
      vcEyes: 'VCs watching',
      marketOpportunity: 'Market Opportunity',
      remixReady: 'Remix Ready'
    }
  };

  useEffect(() => {
    const simulateReactions = async () => {
      // Simulate progressive loading with delays
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReactions(prev => ({
        ...prev,
        competitorCount: Math.floor(Math.random() * 12) + 3
      }));

      await new Promise(resolve => setTimeout(resolve, 800));
      
      setReactions(prev => ({
        ...prev,
        vcInterest: Math.floor(Math.random() * 8) + 2
      }));

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const gptScore = Math.random() * 3 + 6; // 6-9 range
      setReactions(prev => ({
        ...prev,
        gptPrediction: gptScore,
        similarIdeas: Math.floor(Math.random() * 5) + 2,
        marketSize: ['$50M', '$120M', '$300M', '$1B+'][Math.floor(Math.random() * 4)],
        urgencyScore: Math.floor(Math.random() * 30) + 70,
        remixSuggestions: [
          '글로벌 시장 확장 버전',
          'B2B SaaS 모델 적용',
          'AI 자동화 추가 버전'
        ]
      }));

      setProcessing(false);
    };

    simulateReactions();
  }, [ideaText]);

  const handlePredictionSubmit = () => {
    const accuracy = 100 - Math.abs(userPrediction - reactions.gptPrediction) * 10;
    const bonusXP = Math.floor(accuracy / 10) * 5;
    
    setShowPredictionGame(false);
    onReactionComplete({ ...reactions, predictionBonus: bonusXP });
  };

  return (
    <div className="space-y-4">
      {/* Real-time Processing Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${processing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
              <div>
                <div className="text-sm font-medium text-blue-800">
                  {text[currentLanguage].predicting}
                </div>
                {!processing && (
                  <div className="text-lg font-bold text-blue-600">
                    {reactions.gptPrediction.toFixed(1)}/10
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-purple-800">
                  {text[currentLanguage].vcChecking}
                </div>
                {reactions.vcInterest > 0 && (
                  <div className="text-lg font-bold text-purple-600">
                    {reactions.vcInterest}{text[currentLanguage].vcEyes}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm font-medium text-orange-800">
                  경쟁 현황
                </div>
                {reactions.competitorCount > 0 && (
                  <div className="text-lg font-bold text-orange-600">
                    {reactions.competitorCount}{text[currentLanguage].competitor}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Game */}
      {showPredictionGame && !processing && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center justify-center">
                <Target className="w-5 h-5 mr-2" />
                {text[currentLanguage].predictScore}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-700 mb-2">
                  {text[currentLanguage].yourPrediction}: {userPrediction}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={userPrediction}
                  onChange={(e) => setUserPrediction(parseFloat(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <Button 
                onClick={handlePredictionSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                {text[currentLanguage].submit}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Intelligence */}
      {!processing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {text[currentLanguage].marketOpportunity}
              </h4>
              <div className="space-y-2">
                <Badge className="bg-blue-100 text-blue-700">
                  시장 규모: {reactions.marketSize}
                </Badge>
                <div className="text-sm text-gray-600">
                  긴급성 지수: {reactions.urgencyScore}/100
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {text[currentLanguage].remixReady}
              </h4>
              <div className="space-y-1">
                {reactions.remixSuggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IdeaReactionSystem;
