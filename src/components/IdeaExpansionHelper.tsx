
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, HelpCircle } from 'lucide-react';
import { IdeaQuality } from './IdeaQualityAnalyzer';

interface IdeaExpansionHelperProps {
  currentLanguage: 'ko' | 'en';
  originalIdea: string;
  qualityAnalysis: IdeaQuality;
  onExpansionComplete: (expandedIdea: string) => void;
  onSkip: () => void;
}

const IdeaExpansionHelper: React.FC<IdeaExpansionHelperProps> = ({
  currentLanguage,
  originalIdea,
  qualityAnalysis,
  onExpansionComplete,
  onSkip
}) => {
  const [expandedIdea, setExpandedIdea] = useState(originalIdea);
  
  const text = {
    ko: {
      title: '아이디어를 더 구체적으로 만들어보세요',
      subtitle: '더 나은 결과를 위해 아이디어를 발전시켜보겠습니다',
      currentScore: '현재 점수',
      issues: '개선이 필요한 부분',
      suggestions: '제안사항',
      expandButton: '확장된 아이디어로 진행',
      skipButton: '그냥 진행하기',
      helpQuestions: [
        '이 아이디어로 어떤 문제를 해결하려고 하나요?',
        '누가 이것을 필요로 할까요?',
        '기존에는 어떻게 해결하고 있나요?',
        '왜 지금 이 아이디어가 필요한가요?'
      ]
    },
    en: {
      title: 'Let\'s make your idea more specific',
      subtitle: 'We\'ll help develop your idea for better results',
      currentScore: 'Current Score',
      issues: 'Areas for improvement',
      suggestions: 'Suggestions',
      expandButton: 'Proceed with expanded idea',
      skipButton: 'Continue as is',
      helpQuestions: [
        'What problem does this idea solve?',
        'Who would need this?',
        'How is this currently being solved?',
        'Why is this idea needed now?'
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </h2>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Quality Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{text[currentLanguage].currentScore}</CardTitle>
            <Badge variant={qualityAnalysis.score >= 60 ? 'default' : 'destructive'}>
              {qualityAnalysis.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualityAnalysis.issues.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2">{text[currentLanguage].issues}</h4>
              <ul className="list-disc list-inside space-y-1">
                {qualityAnalysis.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {qualityAnalysis.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">{text[currentLanguage].suggestions}</h4>
              <ul className="list-disc list-inside space-y-1">
                {qualityAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helper Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <span>이런 질문들을 생각해보세요</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {text[currentLanguage].helpQuestions.map((question, index) => (
              <div key={index} className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-700">{question}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expansion Input */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Textarea
            value={expandedIdea}
            onChange={(e) => setExpandedIdea(e.target.value)}
            placeholder={currentLanguage === 'ko' ? 
              '위 질문들을 참고해서 아이디어를 더 구체적으로 설명해보세요...' :
              'Use the questions above to describe your idea more specifically...'
            }
            className="min-h-[120px] text-lg resize-none"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {expandedIdea.length}/500
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onSkip}
              >
                {text[currentLanguage].skipButton}
              </Button>
              <Button
                onClick={() => onExpansionComplete(expandedIdea)}
                disabled={expandedIdea.trim().length < 20}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {text[currentLanguage].expandButton}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdeaExpansionHelper;
