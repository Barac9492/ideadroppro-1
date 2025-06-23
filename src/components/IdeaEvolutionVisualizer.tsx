import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, GitBranch, Star, Clock, Zap, ArrowRight, BarChart3 } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';

interface IdeaEvolutionVisualizerProps {
  currentLanguage: 'ko' | 'en';
}

const IdeaEvolutionVisualizer: React.FC<IdeaEvolutionVisualizerProps> = ({ currentLanguage }) => {
  const { ideas, isLoading } = useIdeas(currentLanguage);
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  const text = {
    ko: {
      title: '아이디어 발전 과정',
      subtitle: '시간에 따른 아이디어의 성장과 발전을 시각화',
      noEvolution: '아직 발전 과정을 보여줄 아이디어가 없습니다',
      startJourney: '아이디어 여정을 시작해보세요!',
      timeframes: {
        week: '지난 주',
        month: '지난 달',
        all: '전체 기간'
      },
      metrics: {
        totalIdeas: '총 아이디어',
        avgScore: '평균 점수',
        improved: '개선된 아이디어',
        iterations: '총 반복 개선'
      },
      evolutionStages: {
        initial: '초기 아이디어',
        analysis: 'AI 분석',
        improvement: '개선 진행',
        optimization: '최적화',
        completion: '완성'
      },
      viewDetails: '자세히 보기',
      continueEvolution: '발전 계속하기'
    },
    en: {
      title: 'Idea Evolution Tracker',
      subtitle: 'Visualize the growth and development of your ideas over time',
      noEvolution: 'No evolution journey to show yet',
      startJourney: 'Start your idea journey!',
      timeframes: {
        week: 'Last Week',
        month: 'Last Month',
        all: 'All Time'
      },
      metrics: {
        totalIdeas: 'Total Ideas',
        avgScore: 'Average Score',
        improved: 'Improved Ideas',
        iterations: 'Total Iterations'
      },
      evolutionStages: {
        initial: 'Initial Idea',
        analysis: 'AI Analysis',
        improvement: 'Improvement',
        optimization: 'Optimization',
        completion: 'Completion'
      },
      viewDetails: 'View Details',
      continueEvolution: 'Continue Evolution'
    }
  };

  // Filter user's ideas and calculate evolution metrics
  const userIdeas = ideas.filter(idea => idea.user_id === user?.id);
  
  const evolutionData = userIdeas.map(idea => ({
    id: idea.id,
    text: idea.text,
    initialScore: 3, // Mock initial score
    currentScore: idea.score,
    improvements: idea.improvements?.length || 0,
    stage: getEvolutionStage(idea.score, idea.improvements?.length || 0),
    createdAt: idea.timestamp, // Use timestamp instead of created_at
    progress: Math.min((idea.score / 10) * 100, 100)
  }));

  function getEvolutionStage(score: number, improvements: number): keyof typeof text[typeof currentLanguage]['evolutionStages'] {
    if (score >= 9) return 'completion';
    if (score >= 7) return 'optimization';
    if (improvements > 0) return 'improvement';
    if (score > 0) return 'analysis';
    return 'initial';
  }

  // Calculate metrics
  const metrics = {
    totalIdeas: userIdeas.length,
    avgScore: userIdeas.length > 0 ? (userIdeas.reduce((sum, idea) => sum + idea.score, 0) / userIdeas.length).toFixed(1) : '0',
    improved: evolutionData.filter(item => item.improvements > 0).length,
    iterations: evolutionData.reduce((sum, item) => sum + item.improvements, 0)
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2 mb-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span>{text[currentLanguage].title}</span>
        </h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center space-x-2">
        {(['week', 'month', 'all'] as const).map((timeframe) => (
          <Button
            key={timeframe}
            variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe(timeframe)}
          >
            {text[currentLanguage].timeframes[timeframe]}
          </Button>
        ))}
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.totalIdeas}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].metrics.totalIdeas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.avgScore}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].metrics.avgScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.improved}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].metrics.improved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.iterations}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].metrics.iterations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Evolution Timeline */}
      {evolutionData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {text[currentLanguage].noEvolution}
            </h3>
            <p className="text-gray-500 mb-6">
              아이디어를 제출하고 개선해나가면서 발전 과정을 추적해보세요.
            </p>
            <Button
              onClick={() => window.location.href = '/submit'}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              {text[currentLanguage].startJourney}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {evolutionData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStageColor(item.stage)}>
                        {text[currentLanguage].evolutionStages[item.stage]}
                      </Badge>
                      <Badge variant="outline">
                        {item.improvements}회 개선
                      </Badge>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{item.text}</p>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {item.currentScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      +{(item.currentScore - item.initialScore).toFixed(1)} 개선
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>발전 진행률</span>
                      <span>{item.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                  
                  {/* Evolution Steps */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <GitBranch className="w-4 h-4" />
                    <span>초기 {item.initialScore.toFixed(1)}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>현재 {item.currentScore.toFixed(1)}</span>
                    {item.stage !== 'completion' && (
                      <>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-green-600">목표 10.0</span>
                      </>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {text[currentLanguage].viewDetails}
                    </Button>
                    {item.stage !== 'completion' && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                        onClick={() => window.location.href = `/builder?improve=${item.id}`}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {text[currentLanguage].continueEvolution}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaEvolutionVisualizer;
