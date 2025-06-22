
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, CheckCircle, ArrowRight, Lightbulb, Target, Zap } from 'lucide-react';
import { generateSmartQuestions } from './SmartQuestionGenerator';

interface AIImprovementQueueProps {
  currentLanguage: 'ko' | 'en';
}

interface ImprovementSuggestion {
  id: string;
  ideaText: string;
  currentScore: number;
  targetScore: number;
  questions: any[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

const AIImprovementQueue: React.FC<AIImprovementQueueProps> = ({ currentLanguage }) => {
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const text = {
    ko: {
      title: 'AI 개선 제안 큐',
      subtitle: '아이디어를 한 단계 더 발전시킬 수 있는 맞춤형 제안',
      generateSuggestions: '새 제안 생성',
      noSuggestions: '개선 제안이 없습니다',
      createSuggestions: '첫 번째 제안을 생성해보세요!',
      startImprovement: '개선 시작',
      viewDetails: '자세히 보기',
      priority: {
        high: '높음',
        medium: '보통',
        low: '낮음'
      },
      status: {
        pending: '대기중',
        in_progress: '진행중',
        completed: '완료'
      },
      scoreImprovement: '점수 향상 예상',
      estimatedTime: '예상 소요시간',
      questions: '질문',
      minutes: '분'
    },
    en: {
      title: 'AI Improvement Queue',
      subtitle: 'Personalized suggestions to take your ideas to the next level',
      generateSuggestions: 'Generate New Suggestions',
      noSuggestions: 'No improvement suggestions',
      createSuggestions: 'Generate your first suggestions!',
      startImprovement: 'Start Improvement',
      viewDetails: 'View Details',
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      status: {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed'
      },
      scoreImprovement: 'Expected Score Improvement',
      estimatedTime: 'Estimated Time',
      questions: 'Questions', 
      minutes: 'min'
    }
  };

  // Mock data for demonstration
  const mockSuggestions: ImprovementSuggestion[] = [
    {
      id: '1',
      ideaText: '카페 배달 앱',
      currentScore: 6.5,
      targetScore: 8.2,
      questions: [],
      priority: 'high',
      status: 'pending',
      createdAt: new Date()
    },
    {
      id: '2', 
      ideaText: '온라인 과외 플랫폼',
      currentScore: 7.1,
      targetScore: 8.5,
      questions: [],
      priority: 'medium',
      status: 'in_progress',
      createdAt: new Date()
    }
  ];

  useEffect(() => {
    // Load improvement suggestions for user's ideas
    setSuggestions(mockSuggestions);
  }, []);

  const generateNewSuggestions = async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch user's ideas and generate suggestions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSuggestion: ImprovementSuggestion = {
        id: Date.now().toString(),
        ideaText: '스마트 홈 IoT 솔루션',
        currentScore: 5.8,
        targetScore: 7.9,
        questions: await generateSmartQuestions('스마트 홈 IoT 솔루션', currentLanguage),
        priority: 'high',
        status: 'pending',
        createdAt: new Date()
      };
      
      setSuggestions(prev => [newSuggestion, ...prev]);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startImprovement = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId 
          ? { ...s, status: 'in_progress' as const }
          : s
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Zap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-500" />
            {text[currentLanguage].title}
          </h2>
          <p className="text-gray-600 mt-2">{text[currentLanguage].subtitle}</p>
        </div>
        <Button
          onClick={generateNewSuggestions}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          <Brain className="w-4 h-4 mr-2" />
          {loading ? '생성 중...' : text[currentLanguage].generateSuggestions}
        </Button>
      </div>

      {/* Suggestions List */}
      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {text[currentLanguage].noSuggestions}
            </h3>
            <p className="text-gray-500 mb-6">
              {text[currentLanguage].createSuggestions}
            </p>
            <Button
              onClick={generateNewSuggestions}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Brain className="w-4 h-4 mr-2" />
              {text[currentLanguage].generateSuggestions}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                      {suggestion.ideaText}
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {text[currentLanguage].priority[suggestion.priority]}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        {getStatusIcon(suggestion.status)}
                        <span className="ml-1">{text[currentLanguage].status[suggestion.status]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                      {text[currentLanguage].scoreImprovement}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {suggestion.currentScore} → {suggestion.targetScore}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>{text[currentLanguage].scoreImprovement}</span>
                      <span>+{(suggestion.targetScore - suggestion.currentScore).toFixed(1)}</span>
                    </div>
                    <Progress 
                      value={((suggestion.targetScore - suggestion.currentScore) / 4) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Target className="w-4 h-4 mr-1" />
                      <span>{text[currentLanguage].questions}: {suggestion.questions.length || 3}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{text[currentLanguage].estimatedTime}: 15-20{text[currentLanguage].minutes}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => startImprovement(suggestion.id)}
                      disabled={suggestion.status === 'completed'}
                      className="flex-1"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {suggestion.status === 'pending' 
                        ? text[currentLanguage].startImprovement
                        : suggestion.status === 'in_progress'
                        ? '계속하기'
                        : '완료됨'
                      }
                    </Button>
                    <Button variant="outline">
                      {text[currentLanguage].viewDetails}
                    </Button>
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

export default AIImprovementQueue;
