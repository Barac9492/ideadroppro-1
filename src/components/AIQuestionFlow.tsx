
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, MessageSquare, ArrowRight, Star, Zap, HelpCircle } from 'lucide-react';
import { generateAdaptiveQuestions } from '@/components/AdaptiveQuestionGenerator';
import { analyzeIdeaQuality } from '@/components/IdeaQualityAnalyzer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  moduleType: string;
  question: string;
  educationalTip?: string;
  followUpQuestions?: string[];
}

interface AIQuestionFlowProps {
  currentLanguage: 'ko' | 'en';
  initialIdea: string;
  onComplete: (modules: any[], unifiedIdea: string, grade: string) => void;
}

const AIQuestionFlow: React.FC<AIQuestionFlowProps> = ({
  currentLanguage,
  initialIdea,
  onComplete
}) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [answerQuality, setAnswerQuality] = useState<'good' | 'needs_improvement' | null>(null);

  const text = {
    ko: {
      title: 'AI가 맞춤 질문을 드릴게요',
      subtitle: '각 질문에 답하시면 완전한 비즈니스 모델이 만들어져요',
      nextButton: '다음 질문',
      finalButton: '아이디어 완성하기',
      answerPlaceholder: '솔직하고 구체적으로 답변해 주세요...',
      loadingQuestions: 'AI가 맞춤 질문을 준비하는 중...',
      generatingIdea: '1차 아이디어를 완성하는 중...',
      progress: '진행률',
      educationalTip: '💡 팁',
      followUpTitle: '추가로 생각해볼 점들',
      answerTooShort: '답변이 너무 짧습니다. 더 구체적으로 설명해주세요.',
      goodAnswer: '좋은 답변입니다!',
      moduleTypes: {
        problem_definition: '문제 정의',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        competitive_advantage: '경쟁 우위'
      }
    },
    en: {
      title: 'AI will ask you tailored questions',
      subtitle: 'Answer each question to create a complete business model',
      nextButton: 'Next Question',
      finalButton: 'Complete Idea',
      answerPlaceholder: 'Please answer honestly and specifically...',
      loadingQuestions: 'AI is preparing tailored questions...',
      generatingIdea: 'Generating your 1st complete idea...',
      progress: 'Progress',
      educationalTip: '💡 Tip',
      followUpTitle: 'Additional points to consider',
      answerTooShort: 'Answer is too short. Please explain more specifically.',
      goodAnswer: 'Great answer!',
      moduleTypes: {
        problem_definition: 'Problem Definition',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        competitive_advantage: 'Competitive Advantage'
      }
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    // Analyze answer quality when user types
    if (currentAnswer.length > 0) {
      const quality = currentAnswer.length < 30 ? 'needs_improvement' : 'good';
      setAnswerQuality(quality);
    } else {
      setAnswerQuality(null);
    }
  }, [currentAnswer]);

  const loadQuestions = async () => {
    try {
      // Analyze idea quality to determine question complexity
      const qualityAnalysis = analyzeIdeaQuality(initialIdea, currentLanguage);
      
      // Generate adaptive questions
      const adaptiveQuestions = await generateAdaptiveQuestions(
        initialIdea, 
        qualityAnalysis, 
        currentLanguage
      );
      
      setQuestions(adaptiveQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast({
        title: currentLanguage === 'ko' ? '오류 발생' : 'Error occurred',
        description: currentLanguage === 'ko' ? '질문 생성에 실패했습니다' : 'Failed to generate questions',
        variant: 'destructive',
      });
    }
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim() || currentAnswer.length < 10) {
      toast({
        title: currentLanguage === 'ko' ? '답변이 부족합니다' : 'Answer is insufficient',
        description: currentLanguage === 'ko' ? '더 구체적으로 설명해주세요' : 'Please explain more specifically',
        variant: 'destructive',
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = {
      ...answers,
      [currentQuestion.moduleType]: currentAnswer.trim()
    };
    setAnswers(newAnswers);
    setCurrentAnswer('');
    setAnswerQuality(null);
    setShowFollowUp(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generateFinalIdea(newAnswers);
    }
  };

  const generateFinalIdea = async (finalAnswers: Record<string, string>) => {
    if (!user) return;

    setIsGeneratingIdea(true);
    try {
      // Generate unified idea
      const { data, error } = await supabase.functions.invoke('generate-unified-idea', {
        body: {
          originalIdea: initialIdea,
          modules: finalAnswers,
          language: currentLanguage
        }
      });

      if (error) throw error;

      const unifiedIdea = data.unifiedIdea;

      // Generate AI grade based on answer quality
      const totalAnswerLength = Object.values(finalAnswers).join('').length;
      const avgAnswerLength = totalAnswerLength / Object.keys(finalAnswers).length;
      
      let gradeOptions = ['C', 'D', 'F'];
      if (avgAnswerLength > 100) gradeOptions = ['A+', 'A', 'B+', 'B'];
      else if (avgAnswerLength > 50) gradeOptions = ['B', 'B+', 'C+', 'C'];
      else if (avgAnswerLength > 30) gradeOptions = ['C', 'C+', 'D'];
      
      const randomGrade = gradeOptions[Math.floor(Math.random() * gradeOptions.length)];

      // Convert answers to modules format
      const modules = Object.entries(finalAnswers).map(([moduleType, content]) => ({
        id: `temp-${moduleType}-${Date.now()}`,
        module_type: moduleType,
        content: content,
        tags: [],
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        quality_score: avgAnswerLength > 50 ? 0.8 : 0.4,
        usage_count: 0
      }));

      onComplete(modules, unifiedIdea, randomGrade);

      toast({
        title: currentLanguage === 'ko' ? '1차 아이디어 완성!' : '1st Idea Complete!',
        description: currentLanguage === 'ko' ? 
          `${randomGrade} 등급! 리믹스로 더 높은 등급에 도전해보세요!` :
          `Grade ${randomGrade}! Challenge for higher grades with remix!`,
      });

    } catch (error) {
      console.error('Failed to generate final idea:', error);
      toast({
        title: currentLanguage === 'ko' ? '오류 발생' : 'Error occurred',
        description: currentLanguage === 'ko' ? '아이디어 생성에 실패했습니다' : 'Failed to generate idea',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentAnswer.trim() && currentAnswer.length >= 10) {
        handleAnswerSubmit();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {text[currentLanguage].loadingQuestions}
        </h2>
      </div>
    );
  }

  if (isGeneratingIdea) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <Zap className="w-16 h-16 text-purple-600 mx-auto mb-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {text[currentLanguage].generatingIdea}
        </h2>
        <Progress value={85} className="w-full max-w-md mx-auto" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with progress */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          <span>{text[currentLanguage].title}</span>
        </h1>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{text[currentLanguage].progress}</span>
            <span>{currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* Current Question Card */}
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-purple-100 text-purple-700">
              {text[currentLanguage].moduleTypes[currentQuestion.moduleType as keyof typeof text[typeof currentLanguage]['moduleTypes']] || currentQuestion.moduleType}
            </Badge>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">핵심 질문</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Educational Tip */}
          {currentQuestion.educationalTip && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-700">
                <strong>{text[currentLanguage].educationalTip}:</strong> {currentQuestion.educationalTip}
              </p>
            </div>
          )}

          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={text[currentLanguage].answerPlaceholder}
            className="min-h-[120px] text-lg resize-none"
            maxLength={500}
          />

          {/* Answer Quality Feedback */}
          {answerQuality && (
            <div className={`text-sm p-2 rounded ${
              answerQuality === 'good' 
                ? 'bg-green-50 text-green-600' 
                : 'bg-yellow-50 text-yellow-600'
            }`}>
              {answerQuality === 'good' 
                ? text[currentLanguage].goodAnswer
                : text[currentLanguage].answerTooShort
              }
            </div>
          )}

          {/* Follow-up Questions */}
          {currentQuestion.followUpQuestions && currentAnswer.length > 30 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setShowFollowUp(!showFollowUp)}
              >
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {text[currentLanguage].followUpTitle}
                </span>
              </div>
              {showFollowUp && (
                <div className="mt-2 space-y-1">
                  {currentQuestion.followUpQuestions.map((followUp, index) => (
                    <p key={index} className="text-xs text-gray-600 ml-6">• {followUp}</p>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {currentAnswer.length}/500
            </div>
            <Button
              onClick={handleAnswerSubmit}
              disabled={!currentAnswer.trim() || currentAnswer.length < 10}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3"
            >
              {isLastQuestion ? (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {text[currentLanguage].finalButton}
                </>
              ) : (
                <>
                  {text[currentLanguage].nextButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answered Questions Preview */}
      {Object.keys(answers).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              {currentLanguage === 'ko' ? '완료된 답변' : 'Completed Answers'} ({Object.keys(answers).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(answers).map(([moduleType, answer]) => (
                <div key={moduleType} className="bg-gray-50 p-3 rounded-lg">
                  <Badge variant="secondary" className="mb-2">
                    {text[currentLanguage].moduleTypes[moduleType as keyof typeof text[typeof currentLanguage]['moduleTypes']] || moduleType}
                  </Badge>
                  <p className="text-sm text-gray-700 line-clamp-2">{answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIQuestionFlow;
