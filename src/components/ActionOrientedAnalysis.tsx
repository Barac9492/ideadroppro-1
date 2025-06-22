
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, CheckCircle, Clock, Target, Lightbulb } from 'lucide-react';

interface ActionStep {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'now' | 'week' | 'month';
  completed: boolean;
}

interface ActionOrientedAnalysisProps {
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  pitchPoints?: string[];
  currentLanguage: 'ko' | 'en';
  onStepComplete?: (stepId: string) => void;
}

const ActionOrientedAnalysis: React.FC<ActionOrientedAnalysisProps> = ({
  aiAnalysis,
  improvements,
  marketPotential,
  pitchPoints,
  currentLanguage,
  onStepComplete
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const text = {
    ko: {
      title: '아이디어 실행 계획',
      nowTitle: '지금 당장 할 일',
      weekTitle: '이번 주 목표',
      monthTitle: '한 달 계획',
      priority: {
        high: '중요',
        medium: '보통',
        low: '나중에'
      },
      timeframe: {
        now: '오늘',
        week: '이번 주',
        month: '이번 달'
      },
      completed: '완료됨',
      markComplete: '완료 표시',
      keyInsight: '핵심 인사이트'
    },
    en: {
      title: 'Idea Action Plan',
      nowTitle: 'Do Right Now',
      weekTitle: 'This Week Goals',
      monthTitle: 'Monthly Plan',
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      timeframe: {
        now: 'Today',
        week: 'This Week',
        month: 'This Month'
      },
      completed: 'Completed',
      markComplete: 'Mark Complete',
      keyInsight: 'Key Insight'
    }
  };

  // Convert AI analysis into actionable steps
  const generateActionSteps = (): ActionStep[] => {
    const steps: ActionStep[] = [];
    
    // Extract immediate actions from improvements
    if (improvements) {
      improvements.slice(0, 2).forEach((improvement, index) => {
        steps.push({
          id: `now-${index}`,
          title: improvement.split('.')[0] || improvement.substring(0, 50),
          description: improvement,
          priority: 'high',
          timeframe: 'now',
          completed: false
        });
      });
    }

    // Extract week goals from market potential
    if (marketPotential) {
      marketPotential.slice(0, 2).forEach((potential, index) => {
        steps.push({
          id: `week-${index}`,
          title: potential.split('.')[0] || potential.substring(0, 50),
          description: potential,
          priority: 'medium',
          timeframe: 'week',
          completed: false
        });
      });
    }

    // Extract monthly goals from pitch points
    if (pitchPoints) {
      pitchPoints.slice(0, 2).forEach((point, index) => {
        steps.push({
          id: `month-${index}`,
          title: point.split('.')[0] || point.substring(0, 50),
          description: point,
          priority: 'medium',
          timeframe: 'month',
          completed: false
        });
      });
    }

    return steps;
  };

  const actionSteps = generateActionSteps();
  const stepsByTimeframe = {
    now: actionSteps.filter(step => step.timeframe === 'now'),
    week: actionSteps.filter(step => step.timeframe === 'week'),
    month: actionSteps.filter(step => step.timeframe === 'month')
  };

  const handleStepToggle = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    onStepComplete?.(stepId);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTimeframeIcon = (timeframe: 'now' | 'week' | 'month') => {
    switch (timeframe) {
      case 'now': return <Lightbulb className="w-4 h-4 text-orange-500" />;
      case 'week': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'month': return <Target className="w-4 h-4 text-purple-500" />;
    }
  };

  // Extract key insight from AI analysis
  const getKeyInsight = () => {
    if (!aiAnalysis) return null;
    
    // Simple extraction of first meaningful sentence
    const sentences = aiAnalysis.split(/[.!?]/).filter(s => s.trim().length > 20);
    return sentences[0]?.trim() + '.';
  };

  const keyInsight = getKeyInsight();

  return (
    <div className="space-y-4">
      {/* Key Insight */}
      {keyInsight && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {text[currentLanguage].keyInsight}
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {keyInsight}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Steps */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            {text[currentLanguage].title}
          </h3>

          <div className="space-y-6">
            {/* Now Section */}
            {stepsByTimeframe.now.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                  {getTimeframeIcon('now')}
                  <span className="ml-2">{text[currentLanguage].nowTitle}</span>
                </h4>
                <div className="space-y-2">
                  {stepsByTimeframe.now.map((step) => (
                    <div key={step.id} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <Checkbox
                        checked={completedSteps.has(step.id)}
                        onCheckedChange={() => handleStepToggle(step.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-medium ${completedSteps.has(step.id) ? 'line-through text-gray-500' : ''}`}>
                            {step.title}
                          </span>
                          <Badge className={getPriorityColor(step.priority)}>
                            {text[currentLanguage].priority[step.priority]}
                          </Badge>
                        </div>
                        <p className={`text-xs text-gray-600 ${completedSteps.has(step.id) ? 'line-through' : ''}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Week Section */}
            {stepsByTimeframe.week.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                  {getTimeframeIcon('week')}
                  <span className="ml-2">{text[currentLanguage].weekTitle}</span>
                </h4>
                <div className="space-y-2">
                  {stepsByTimeframe.week.map((step) => (
                    <div key={step.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Checkbox
                        checked={completedSteps.has(step.id)}
                        onCheckedChange={() => handleStepToggle(step.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-medium ${completedSteps.has(step.id) ? 'line-through text-gray-500' : ''}`}>
                            {step.title}
                          </span>
                          <Badge className={getPriorityColor(step.priority)}>
                            {text[currentLanguage].priority[step.priority]}
                          </Badge>
                        </div>
                        <p className={`text-xs text-gray-600 ${completedSteps.has(step.id) ? 'line-through' : ''}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Month Section */}
            {stepsByTimeframe.month.length > 0 && (
              <div>
                <h4 className="font-semibold text-purple-700 mb-3 flex items-center">
                  {getTimeframeIcon('month')}
                  <span className="ml-2">{text[currentLanguage].monthTitle}</span>
                </h4>
                <div className="space-y-2">
                  {stepsByTimeframe.month.map((step) => (
                    <div key={step.id} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Checkbox
                        checked={completedSteps.has(step.id)}
                        onCheckedChange={() => handleStepToggle(step.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-medium ${completedSteps.has(step.id) ? 'line-through text-gray-500' : ''}`}>
                            {step.title}
                          </span>
                          <Badge className={getPriorityColor(step.priority)}>
                            {text[currentLanguage].priority[step.priority]}
                          </Badge>
                        </div>
                        <p className={`text-xs text-gray-600 ${completedSteps.has(step.id) ? 'line-through' : ''}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionOrientedAnalysis;
