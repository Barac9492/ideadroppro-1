
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, HelpCircle, Heart, Star } from 'lucide-react';
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
      title: '💫 함께 아이디어를 더 빛나게 만들어볼까요?',
      subtitle: '이미 좋은 시작이에요! 조금만 더 구체적으로 만들어보겠습니다',
      currentScore: '현재 완성도',
      strengths: '👍 이미 좋은 점들',
      suggestions: '✨ 더 발전시킬 수 있는 부분',
      expandButton: '더 발전시켜서 진행하기',
      skipButton: '이대로도 충분해요',
      encouragement: '창의적인 아이디어네요! 👏',
      helpQuestions: [
        '이 아이디어로 어떤 문제를 해결하려고 하나요?',
        '누가 이것을 필요로 할까요?',
        '기존에는 어떻게 해결하고 있나요?',
        '왜 지금 이 아이디어가 필요한가요?'
      ]
    },
    en: {
      title: '💫 Let\'s make your idea shine even brighter!',
      subtitle: 'Great start! Let\'s make it a bit more specific together',
      currentScore: 'Current Completion',
      strengths: '👍 Already great aspects',
      suggestions: '✨ Areas we can enhance',
      expandButton: 'Let\'s enhance it further',
      skipButton: 'This is good enough',
      encouragement: 'Creative idea! 👏',
      helpQuestions: [
        'What problem does this idea solve?',
        'Who would need this?',
        'How is this currently being solved?',
        'Why is this idea needed now?'
      ]
    }
  };

  // Focus on positive aspects first
  const getPositiveAspects = () => {
    const aspects = [];
    if (originalIdea.length > 20) aspects.push(currentLanguage === 'ko' ? '구체적인 설명' : 'Detailed description');
    if (originalIdea.includes('문제') || originalIdea.includes('problem')) aspects.push(currentLanguage === 'ko' ? '문제 인식' : 'Problem awareness');
    if (originalIdea.includes('사용자') || originalIdea.includes('user')) aspects.push(currentLanguage === 'ko' ? '사용자 고려' : 'User consideration');
    if (aspects.length === 0) aspects.push(currentLanguage === 'ko' ? '창의적 접근' : 'Creative approach');
    return aspects;
  };

  // Convert harsh issues to gentle suggestions
  const getGentleSuggestions = () => {
    const suggestions = [];
    if (qualityAnalysis.score < 50) {
      suggestions.push(currentLanguage === 'ko' ? 
        '더 구체적인 설명을 추가하면 더 좋을 거예요' : 
        'Adding more specific details would be great');
    }
    if (qualityAnalysis.specificityScore < 40) {
      suggestions.push(currentLanguage === 'ko' ? 
        '타겟 고객이나 구체적인 상황을 언급해보세요' : 
        'Try mentioning target customers or specific situations');
    }
    return suggestions;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encouraging Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-2xl">
          <Heart className="w-6 h-6 text-pink-500" />
          <span>{text[currentLanguage].encouragement}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </h2>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Positive Quality Analysis */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>{text[currentLanguage].currentScore}</span>
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {qualityAnalysis.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Positive Aspects First */}
          <div>
            <h4 className="font-semibold text-green-600 mb-2">{text[currentLanguage].strengths}</h4>
            <div className="flex flex-wrap gap-2">
              {getPositiveAspects().map((aspect, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                  {aspect}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Gentle Suggestions */}
          {getGentleSuggestions().length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">{text[currentLanguage].suggestions}</h4>
              <ul className="list-disc list-inside space-y-1">
                {getGentleSuggestions().map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helpful Questions */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-700">
            <HelpCircle className="w-5 h-5" />
            <span>이런 질문들을 생각해보세요</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {text[currentLanguage].helpQuestions.map((question, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-purple-200">
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
              '자유롭게 생각나는 대로 적어보세요... 완벽하지 않아도 괜찮아요!' :
              'Feel free to write whatever comes to mind... It doesn\'t have to be perfect!'
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
                className="border-gray-300 text-gray-600 hover: bg-gray-50"
              >
                {text[currentLanguage].skipButton}
              </Button>
              <Button
                onClick={() => onExpansionComplete(expandedIdea)}
                disabled={expandedIdea.trim().length < 10}
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
