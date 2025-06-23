import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Zap, CheckCircle, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';

interface AIImprovementQueueProps {
  currentLanguage: 'ko' | 'en';
}

const AIImprovementQueue: React.FC<AIImprovementQueueProps> = ({ currentLanguage }) => {
  const { ideas, isLoading } = useIdeas(currentLanguage);
  const { user } = useAuth();
  const [processingItems, setProcessingItems] = useState<string[]>([]);

  const text = {
    ko: {
      title: 'AI 개선 제안',
      subtitle: 'AI가 분석한 개선점과 자동 최적화 제안',
      queueEmpty: '현재 개선 대기열이 비어있습니다',
      startImproving: '아이디어 개선 시작하기',
      processing: '처리 중',
      completed: '완료',
      pending: '대기 중',
      highPriority: '높은 우선순위',
      mediumPriority: '보통 우선순위',
      lowPriority: '낮은 우선순위',
      applyImprovement: '개선 적용하기',
      viewDetails: '자세히 보기',
      autoImprove: '자동 개선',
      suggestions: {
        scoreBoost: '점수 향상 가능',
        marketAnalysis: '시장 분석 필요',
        competitiveEdge: '경쟁력 강화',
        valueProposition: '가치 제안 개선',
        revenueModel: '수익 모델 최적화'
      }
    },
    en: {
      title: 'AI Improvement Queue',
      subtitle: 'AI-analyzed improvements and automated optimization suggestions',
      queueEmpty: 'No improvements in queue currently',
      startImproving: 'Start Improving Ideas',
      processing: 'Processing',
      completed: 'Completed',
      pending: 'Pending',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority',
      applyImprovement: 'Apply Improvement',
      viewDetails: 'View Details',
      autoImprove: 'Auto Improve',
      suggestions: {
        scoreBoost: 'Score Boost Possible',
        marketAnalysis: 'Market Analysis Needed',
        competitiveEdge: 'Competitive Edge',
        valueProposition: 'Value Proposition',
        revenueModel: 'Revenue Model'
      }
    }
  };

  // Filter user's ideas that need improvement
  const improvementCandidates = ideas
    .filter(idea => idea.user_id === user?.id && idea.score < 8)
    .map(idea => ({
      id: idea.id,
      text: idea.text,
      score: idea.score,
      priority: idea.score < 5 ? 'high' : idea.score < 7 ? 'medium' : 'low',
      suggestions: [
        idea.score < 6 ? 'scoreBoost' : null,
        !idea.aiAnalysis ? 'marketAnalysis' : null,
        idea.score < 7 ? 'competitiveEdge' : null,
        'valueProposition',
        'revenueModel'
      ].filter(Boolean) as string[]
    }));

  const handleApplyImprovement = async (ideaId: string) => {
    setProcessingItems(prev => [...prev, ideaId]);
    
    // Simulate AI processing
    setTimeout(() => {
      setProcessingItems(prev => prev.filter(id => id !== ideaId));
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return text[currentLanguage].highPriority;
      case 'medium': return text[currentLanguage].mediumPriority;
      case 'low': return text[currentLanguage].lowPriority;
      default: return '';
    }
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
          <Brain className="w-6 h-6 text-purple-600" />
          <span>{text[currentLanguage].title}</span>
        </h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Queue Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>개선 대기열 상태</span>
            <Badge variant="secondary">
              {improvementCandidates.length}개 아이디어
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {improvementCandidates.filter(item => item.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-500">{text[currentLanguage].highPriority}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {improvementCandidates.filter(item => item.priority === 'medium').length}
              </div>
              <div className="text-sm text-gray-500">{text[currentLanguage].mediumPriority}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {improvementCandidates.filter(item => item.priority === 'low').length}
              </div>
              <div className="text-sm text-gray-500">{text[currentLanguage].lowPriority}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Queue */}
      {improvementCandidates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {text[currentLanguage].queueEmpty}
            </h3>
            <p className="text-gray-500 mb-6">
              모든 아이디어가 이미 최적화되었거나 개선이 필요한 아이디어가 없습니다.
            </p>
            <Button
              onClick={() => window.location.href = '/submit'}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {text[currentLanguage].startImproving}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {improvementCandidates.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {getPriorityText(item.priority)}
                      </Badge>
                      <Badge variant="outline">
                        점수: {item.score.toFixed(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{item.text}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {processingItems.includes(item.id) ? (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{text[currentLanguage].processing}</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleApplyImprovement(item.id)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {text[currentLanguage].autoImprove}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">AI 개선 제안:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.suggestions.map((suggestion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {text[currentLanguage].suggestions[suggestion as keyof typeof text[typeof currentLanguage]['suggestions']]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {processingItems.includes(item.id) && (
                    <div className="space-y-2">
                      <Progress value={66} className="h-2" />
                      <p className="text-xs text-gray-500">AI가 개선안을 생성하고 있습니다...</p>
                    </div>
                  )}
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
