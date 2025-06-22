import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Lightbulb, Target, Users, DollarSign, Image, CheckCircle } from 'lucide-react';
import { useModularIdeas } from '@/hooks/useModularIdeas';
import { useAIImageGeneration } from '@/hooks/useAIImageGeneration';
import { toast } from '@/hooks/use-toast';

interface ProgressiveIdeaBuilderProps {
  initialIdea: string;
  aiAnalysis?: any;
  currentLanguage: 'ko' | 'en';
  onComplete: (completedIdea: any) => void;
  onCancel: () => void;
}

const moduleIcons: Record<string, any> = {
  problem: Target,
  solution: Lightbulb,
  target_customer: Users,
  value_proposition: DollarSign,
  revenue_model: DollarSign,
  key_activities: Target,
  key_resources: Target,
  channels: Target,
  competitive_advantage: Target,
  market_size: Target,
  team: Users,
  potential_risks: Target
};

const ProgressiveIdeaBuilder: React.FC<ProgressiveIdeaBuilderProps> = ({
  initialIdea,
  aiAnalysis,
  currentLanguage,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [modules, setModules] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { decomposeIdea, decomposing } = useModularIdeas({ currentLanguage });
  const { generateIdeaImage, isGenerating: isGeneratingImage } = useAIImageGeneration();

  const text = {
    ko: {
      title: '아이디어 완성하기',
      subtitle: '단계별 질문에 답하여 아이디어를 보완해보세요',
      aiAnalyzedTitle: 'AI 구체화 결과 기반 보완',
      aiAnalyzedSubtitle: 'AI가 이미 분석한 내용을 바탕으로 추가 보완해보세요',
      progress: '진행률',
      question: '질문',
      answer: '답변',
      next: '다음',
      previous: '이전',
      skip: '나중에',
      complete: '완성',
      cancel: '취소',
      answerPlaceholder: '답변을 입력해주세요...',
      generatingQuestions: 'AI가 맞춤형 질문을 생성하는 중...',
      completionReward: '완성 보상',
      generatingImage: 'AI 이미지 생성 중...',
      imageGenerated: 'AI 이미지 생성 완료!',
      preFilledModules: 'AI가 이미 분석한 요소들',
      additionalQuestions: '추가 보완 질문'
    },
    en: {
      title: 'Complete Your Idea',  
      subtitle: 'Answer step-by-step questions to enhance your idea',
      aiAnalyzedTitle: 'AI Analysis-Based Enhancement',
      aiAnalyzedSubtitle: 'Build upon AI analysis with additional details',
      progress: 'Progress',
      question: 'Question',
      answer: 'Answer',
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip',
      complete: 'Complete',
      cancel: 'Cancel',
      answerPlaceholder: 'Enter your answer...',
      generatingQuestions: 'AI is generating personalized questions...',
      completionReward: 'Completion Reward',
      generatingImage: 'Generating AI image...',
      imageGenerated: 'AI image generated!',
      preFilledModules: 'AI Pre-analyzed Elements',
      additionalQuestions: 'Additional Enhancement Questions'
    }
  };

  // Initialize modules with AI analysis data if available
  useEffect(() => {
    if (aiAnalysis?.modules) {
      setModules(aiAnalysis.modules);
    }
  }, [aiAnalysis]);

  // Generate smart questions based on initial idea and existing AI analysis
  const generateQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      // First decompose the idea to identify gaps
      const decomposition = await decomposeIdea(initialIdea);
      
      // Generate questions for missing or weak modules, excluding already filled ones
      const alreadyFilled = aiAnalysis?.modules ? Object.keys(aiAnalysis.modules) : [];
      
      const allModuleQuestions = [
        {
          moduleType: 'problem',
          question: currentLanguage === 'ko' 
            ? `"${initialIdea}"가 해결하려는 핵심 문제를 더 구체적으로 설명해주세요`
            : `Please describe the core problem that "${initialIdea}" aims to solve in more detail`,
          suggestedAnswers: currentLanguage === 'ko'
            ? ['시간 부족 문제', '비용 문제', '효율성 문제', '접근성 문제']
            : ['Time shortage', 'Cost issues', 'Efficiency problems', 'Accessibility issues']
        },
        {
          moduleType: 'target_customer',
          question: currentLanguage === 'ko'
            ? '주요 타겟 고객층을 더 세분화하여 설명해주세요'
            : 'Please provide more detailed segmentation of your target customers',
          suggestedAnswers: currentLanguage === 'ko'
            ? ['직장인', '학생', '주부', '창업가', '시니어']
            : ['Working professionals', 'Students', 'Homemakers', 'Entrepreneurs', 'Seniors']
        },
        {
          moduleType: 'value_proposition',
          question: currentLanguage === 'ko'
            ? '고객에게 제공하는 핵심 가치를 더 명확히 해주세요'
            : 'Please clarify the core value proposition for customers',
          suggestedAnswers: currentLanguage === 'ko'
            ? ['시간 절약', '비용 절감', '편의성 증대', '품질 향상']
            : ['Time saving', 'Cost reduction', 'Convenience', 'Quality improvement']
        },
        {
          moduleType: 'revenue_model',
          question: currentLanguage === 'ko'
            ? '수익 창출 방법을 구체적으로 설명해주세요'
            : 'Please describe your revenue generation strategy in detail',
          suggestedAnswers: currentLanguage === 'ko'
            ? ['구독 모델', '광고 수익', '거래 수수료', '제품 판매']
            : ['Subscription model', 'Advertising', 'Transaction fees', 'Product sales']
        },
        {
          moduleType: 'competitive_advantage',
          question: currentLanguage === 'ko'
            ? '경쟁사 대비 차별화 요소를 더 상세히 설명해주세요'
            : 'Please provide more details on your competitive advantages',
          suggestedAnswers: currentLanguage === 'ko'
            ? ['기술 우위', '가격 경쟁력', '사용자 경험', '브랜드 신뢰도']
            : ['Technical advantage', 'Price competitiveness', 'User experience', 'Brand trust']
        }
      ];

      // Filter out questions for modules already filled by AI
      const relevantQuestions = allModuleQuestions.filter(q => 
        !alreadyFilled.includes(q.moduleType)
      );

      setQuestions(relevantQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  useEffect(() => {
    generateQuestions();
  }, [initialIdea, aiAnalysis]);

  const handleNext = () => {
    if (currentAnswer.trim()) {
      setModules({
        ...modules,
        [questions[currentStep].moduleType]: currentAnswer
      });
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer('');
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentAnswer(modules[questions[currentStep - 1]?.moduleType] || '');
    }
  };

  const handleSkip = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer('');
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    // Generate AI image before completing
    if (!generatedImage) {
      const image = await generateIdeaImage(initialIdea);
      if (image) {
        setGeneratedImage(image);
      }
    }

    const completedIdea = {
      originalText: initialIdea,
      modules: modules,
      completionScore: calculateCompletionScore(),
      isModular: true,
      aiImage: generatedImage
    };
    
    toast({
      title: currentLanguage === 'ko' ? '아이디어 완성!' : 'Idea Completed!',
      description: currentLanguage === 'ko' 
        ? `${calculateCompletionScore()}점 획득!` 
        : `Earned ${calculateCompletionScore()} points!`,
    });
    
    onComplete(completedIdea);
  };

  const calculateCompletionScore = () => {
    const totalModules = Object.keys(modules).length;
    const aiPreFilledBonus = aiAnalysis?.modules ? 20 : 0;
    const imageBonus = generatedImage ? 20 : 0;
    return Math.min(30 + (totalModules * 12) + aiPreFilledBonus + imageBonus, 100);
  };

  const progressPercentage = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  if (isGeneratingQuestions || decomposing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{text[currentLanguage].generatingQuestions}</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentStep];
  const IconComponent = moduleIcons[currentQuestion?.moduleType] || Lightbulb;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* AI Pre-filled Modules Display */}
      {aiAnalysis?.modules && Object.keys(aiAnalysis.modules).length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span>{text[currentLanguage].preFilledModules}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(aiAnalysis.modules).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {key === 'problem' && '문제점'}
                      {key === 'solution' && '솔루션'}  
                      {key === 'target_customer' && '타겟 고객'}
                      {key === 'value_proposition' && '핵심 가치'}
                    </Badge>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-700">{value as string}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Image Generation Status */}
      {isGeneratingImage && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />
              <div>
                <p className="font-medium text-purple-800">{text[currentLanguage].generatingImage}</p>
                <p className="text-sm text-purple-600">AI가 아이디어에 맞는 이미지를 생성하고 있습니다</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Image className="w-5 h-5 text-green-600" />
              <p className="font-medium text-green-800">{text[currentLanguage].imageGenerated}</p>
            </div>
            <img 
              src={generatedImage} 
              alt="AI Generated" 
              className="w-full h-32 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <span>
                  {aiAnalysis ? text[currentLanguage].aiAnalyzedTitle : text[currentLanguage].title}
                </span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {aiAnalysis ? text[currentLanguage].aiAnalyzedSubtitle : text[currentLanguage].subtitle}
              </p>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {currentStep + 1} / {questions.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {aiAnalysis ? text[currentLanguage].additionalQuestions : text[currentLanguage].progress}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5 text-blue-600" />
            <span>{text[currentLanguage].question} {currentStep + 1}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium text-gray-800">
            {currentQuestion.question}
          </p>
          
          {/* Suggested Answers */}
          <div className="flex flex-wrap gap-2">
            {currentQuestion.suggestedAnswers.map((suggestion: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setCurrentAnswer(suggestion)}
                className="text-sm hover:bg-purple-50 hover:border-purple-300"
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          {/* Answer Input */}
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={text[currentLanguage].answerPlaceholder}
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {text[currentLanguage].previous}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            {text[currentLanguage].cancel}
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleSkip}
          >
            {text[currentLanguage].skip}
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {currentStep === questions.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                {text[currentLanguage].complete}
              </>
            ) : (
              <>
                {text[currentLanguage].next}
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Completion Preview */}
      {Object.keys(modules).length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">{text[currentLanguage].completionReward}</p>
                <p className="text-sm text-green-600">
                  {Object.keys(modules).length}개 모듈 완성 
                  {generatedImage && ' + AI 이미지'} → {calculateCompletionScore()}점
                </p>
              </div>
              <Badge className="bg-green-500 text-white">
                +{calculateCompletionScore()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressiveIdeaBuilder;
