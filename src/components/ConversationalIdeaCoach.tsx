
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  ArrowRight, 
  Heart, 
  Star, 
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { IdeaQuality } from './IdeaQualityAnalyzer';

interface ConversationalIdeaCoachProps {
  currentLanguage: 'ko' | 'en';
  originalIdea: string;
  qualityAnalysis: IdeaQuality;
  onExpansionComplete: (expandedIdea: string) => void;
  onProceedAnyway: () => void;
}

const ConversationalIdeaCoach: React.FC<ConversationalIdeaCoachProps> = ({
  currentLanguage,
  originalIdea,
  qualityAnalysis,
  onExpansionComplete,
  onProceedAnyway
}) => {
  const [expandedIdea, setExpandedIdea] = useState(originalIdea);
  const [currentStep, setCurrentStep] = useState(0);
  const [showGuidance, setShowGuidance] = useState(true);

  const text = {
    ko: {
      title: '💫 함께 아이디어를 더 빛나게 만들어볼까요?',
      subtitle: '이미 좋은 아이디어네요! 조금만 더 구체적으로 만들면 훨씬 더 강력해질 거예요',
      currentScore: '현재 완성도',
      strengths: '👍 좋은 점들',
      improvements: '✨ 더 발전시킬 수 있는 부분',
      encouragement: [
        '창의적인 아이디어네요! 👏',
        '이미 좋은 출발점이에요! ⭐',
        '흥미로운 접근이군요! 💡'
      ],
      coachingQuestions: [
        '이 아이디어로 해결하고 싶은 문제가 무엇인가요?',
        '누가 이것을 가장 필요로 할까요?',
        '기존 방식과 어떻게 다른가요?',
        '사람들이 왜 이것을 선택할까요?'
      ],
      stepTitles: [
        '🎯 문제 명확화',
        '👥 타겟 고객',
        '💡 차별점',
        '🎁 가치 제안'
      ],
      continueButton: '이 정도면 충분해요, 계속 진행할래요',
      expandButton: '더 발전시켜서 진행하기',
      skipButton: '나중에 발전시키기',
      backButton: '이전 단계',
      nextStep: '다음 단계로',
      letsImprove: '함께 발전시켜보기',
      yourChoice: '선택은 당신에게 있어요!'
    },
    en: {
      title: '💫 Let\'s make your idea shine even brighter!',
      subtitle: 'You already have a good idea! With a bit more detail, it can become much more powerful',
      currentScore: 'Current Completion',
      strengths: '👍 Great aspects',
      improvements: '✨ Areas we can enhance together',
      encouragement: [
        'Creative idea! 👏',
        'Great starting point! ⭐',
        'Interesting approach! 💡'
      ],
      coachingQuestions: [
        'What problem do you want to solve with this idea?',
        'Who would need this the most?',
        'How is this different from existing solutions?',
        'Why would people choose this?'
      ],
      stepTitles: [
        '🎯 Problem Clarity',
        '👥 Target Audience',
        '💡 Differentiation',
        '🎁 Value Proposition'
      ],
      continueButton: 'This is good enough, let\'s continue',
      expandButton: 'Let\'s enhance it further',
      skipButton: 'I\'ll improve it later',
      backButton: 'Previous step',
      nextStep: 'Next step',
      letsImprove: 'Let\'s improve together',
      yourChoice: 'The choice is yours!'
    }
  };

  const getRandomEncouragement = () => {
    const encouragements = text[currentLanguage].encouragement;
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  const getPositiveAspects = () => {
    const aspects = [];
    if (originalIdea.length > 20) aspects.push(currentLanguage === 'ko' ? '구체적인 설명' : 'Detailed description');
    if (originalIdea.includes('문제') || originalIdea.includes('problem')) aspects.push(currentLanguage === 'ko' ? '문제 인식' : 'Problem awareness');
    if (originalIdea.includes('사용자') || originalIdea.includes('user')) aspects.push(currentLanguage === 'ko' ? '사용자 고려' : 'User consideration');
    if (aspects.length === 0) aspects.push(currentLanguage === 'ko' ? '창의적 접근' : 'Creative approach');
    return aspects;
  };

  const getCurrentQuestion = () => {
    return text[currentLanguage].coachingQuestions[currentStep] || text[currentLanguage].coachingQuestions[0];
  };

  const handleStepComplete = () => {
    if (currentStep < text[currentLanguage].coachingQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onExpansionComplete(expandedIdea);
    }
  };

  const isLastStep = currentStep === text[currentLanguage].coachingQuestions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encouraging Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-2xl">
          <Heart className="w-6 h-6 text-pink-500" />
          <span>{getRandomEncouragement()}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {text[currentLanguage].title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {text[currentLanguage].subtitle}
        </p>
      </div>

      {/* Current Score with Positive Framing */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-green-800">
                {text[currentLanguage].currentScore}
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {qualityAnalysis.score}% 완성
            </Badge>
          </div>
          <Progress value={qualityAnalysis.score} className="mb-4" />
          
          {/* Positive Aspects */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-700 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{text[currentLanguage].strengths}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {getPositiveAspects().map((aspect, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                  {aspect}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {showGuidance && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <MessageCircle className="w-5 h-5" />
              <span>{text[currentLanguage].stepTitles[currentStep]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-blue-700 font-medium mb-3">
                {getCurrentQuestion()}
              </p>
              <Textarea
                value={expandedIdea}
                onChange={(e) => setExpandedIdea(e.target.value)}
                placeholder={currentLanguage === 'ko' ? 
                  '자유롭게 생각나는 대로 적어보세요...' :
                  'Feel free to write whatever comes to mind...'
                }
                className="min-h-[100px] border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {text[currentLanguage].backButton}
              </Button>

              <div className="flex space-x-2">
                {text[currentLanguage].stepTitles.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentStep ? 'bg-blue-500' :
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleStepComplete}
                disabled={expandedIdea.trim().length < 10}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLastStep ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {text[currentLanguage].expandButton}
                  </>
                ) : (
                  <>
                    {text[currentLanguage].nextStep}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flexible Options */}
      <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-lg font-medium text-purple-800">
            {text[currentLanguage].yourChoice}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onProceedAnyway}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              {text[currentLanguage].continueButton}
            </Button>
            <Button
              onClick={() => setShowGuidance(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {text[currentLanguage].letsImprove}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationalIdeaCoach;
