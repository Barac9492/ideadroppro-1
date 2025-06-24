
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, MessageSquare, ArrowRight, Star, Zap } from 'lucide-react';
import { generateSmartQuestions } from '@/components/SmartQuestionGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  moduleType: string;
  question: string;
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

  const loadQuestions = async () => {
    try {
      const generatedQuestions = await generateSmartQuestions(initialIdea, currentLanguage);
      setQuestions(generatedQuestions);
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
    if (!currentAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = {
      ...answers,
      [currentQuestion.moduleType]: currentAnswer.trim()
    };
    setAnswers(newAnswers);
    setCurrentAnswer('');

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

      // Generate AI grade (A-F)
      const gradeOptions = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
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
        quality_score: 0,
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
      if (currentAnswer.trim()) {
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
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={text[currentLanguage].answerPlaceholder}
            className="min-h-[120px] text-lg resize-none"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {currentAnswer.length}/500
            </div>
            <Button
              onClick={handleAnswerSubmit}
              disabled={!currentAnswer.trim()}
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
