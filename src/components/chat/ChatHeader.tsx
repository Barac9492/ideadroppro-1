
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle, Target } from 'lucide-react';

interface ChatHeaderProps {
  currentLanguage: 'ko' | 'en';
  onCancel: () => void;
  totalProgress: number;
  moduleTypes: string[];
  moduleProgress: Record<string, any>;
  currentModuleIndex: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentLanguage,
  onCancel,
  totalProgress,
  moduleTypes,
  moduleProgress,
  currentModuleIndex
}) => {
  const text = {
    ko: {
      title: 'AI 실시간 아이디어 코칭',
      progressLabel: '전체 진행률',
      moduleNames: {
        problem_definition: '문제 정의',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        competitive_advantage: '경쟁 우위'
      }
    },
    en: {
      title: 'AI Real-time Idea Coaching',
      progressLabel: 'Overall Progress',
      moduleNames: {
        problem_definition: 'Problem Definition',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        competitive_advantage: 'Competitive Advantage'
      }
    }
  };

  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </h3>
        <Button variant="ghost" onClick={onCancel} size="sm">
          ✕
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{text[currentLanguage].progressLabel}</span>
          <span>{Math.round(totalProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        
        {/* Module Progress */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {moduleTypes.map((moduleType, index) => {
            const progress = moduleProgress[moduleType];
            const isCompleted = progress && progress.completeness >= 75;
            const isCurrent = index === currentModuleIndex;
            
            return (
              <div key={moduleType} className={`text-center p-2 rounded-lg text-xs ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isCurrent ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {isCompleted && <CheckCircle className="w-3 h-3 mx-auto mb-1" />}
                {isCurrent && <Target className="w-3 h-3 mx-auto mb-1" />}
                <div className="font-medium">
                  {text[currentLanguage].moduleNames[moduleType as keyof typeof text[typeof currentLanguage]['moduleNames']]}
                </div>
                {progress && (
                  <div className="text-xs mt-1">{progress.completeness}%</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
