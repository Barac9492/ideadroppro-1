
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Lightbulb, Target, Wrench, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  moduleType?: string;
  timestamp: Date;
}

interface SmartQuestion {
  moduleType: string;
  question: string;
  suggestedAnswers: string[];
}

interface InteractiveIdeaChatProps {
  initialIdea: string;
  currentLanguage: 'ko' | 'en';
  onComplete: (ideaData: any) => void;
  onCancel: () => void;
}

const InteractiveIdeaChat: React.FC<InteractiveIdeaChatProps> = ({
  initialIdea,
  currentLanguage,
  onComplete,
  onCancel
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ideaData, setIdeaData] = useState<any>({
    originalIdea: initialIdea,
    modules: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [smartQuestions, setSmartQuestions] = useState<SmartQuestion[]>([]);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  const text = {
    ko: {
      welcome: '흥미로운 아이디어네요! AI가 맞춤형 질문을 준비했습니다.',
      placeholder: '자유롭게 답변해주세요...',
      nextButton: '다음 단계',
      completeButton: '완성!',
      skipButton: '건너뛰기',
      thinking: 'AI가 생각 중...',
      generatingQuestion: 'AI가 다음 질문을 준비 중...',
      loadingQuestions: 'AI가 맞춤 질문들을 생성하고 있습니다...',
      errorGeneratingQuestions: '질문 생성 중 오류가 발생했습니다. 기본 질문으로 진행합니다.',
      analyzing: 'AI가 답변을 분석하고 있습니다...'
    },
    en: {
      welcome: 'Interesting idea! AI has prepared customized questions for you.',
      placeholder: 'Feel free to answer...',
      nextButton: 'Next Step',
      completeButton: 'Complete!',
      skipButton: 'Skip',
      thinking: 'AI is thinking...',
      generatingQuestion: 'AI is preparing the next question...',
      loadingQuestions: 'AI is generating customized questions...',
      errorGeneratingQuestions: 'Error generating questions. Proceeding with default questions.',
      analyzing: 'AI is analyzing your response...'
    }
  };

  const fallbackQuestions: SmartQuestion[] = [
    {
      moduleType: 'problem',
      question: currentLanguage === 'ko' ? '이 아이디어가 해결하려는 핵심 문제는 무엇인가요?' : 'What core problem does this idea solve?',
      suggestedAnswers: currentLanguage === 'ko' 
        ? ['효율성 부족', '높은 비용', '접근성 문제', '품질 문제']
        : ['Efficiency issues', 'High costs', 'Accessibility problems', 'Quality issues']
    },
    {
      moduleType: 'target_customer',
      question: currentLanguage === 'ko' ? '주요 타겟 고객은 누구인가요?' : 'Who is your main target customer?',
      suggestedAnswers: currentLanguage === 'ko'
        ? ['개인 사용자', '중소기업', '대기업', '정부기관']
        : ['Individual users', 'Small businesses', 'Enterprises', 'Government']
    },
    {
      moduleType: 'solution',
      question: currentLanguage === 'ko' ? '이 문제를 어떤 방법으로 해결하시겠습니까?' : 'How would you solve this problem?',
      suggestedAnswers: currentLanguage === 'ko'
        ? ['기술적 솔루션', '서비스 개선', '새로운 플랫폼', '자동화']
        : ['Technical solution', 'Service improvement', 'New platform', 'Automation']
    },
    {
      moduleType: 'revenue_model',
      question: currentLanguage === 'ko' ? '어떻게 수익을 만들어낼 수 있을까요?' : 'How could you generate revenue?',
      suggestedAnswers: currentLanguage === 'ko'
        ? ['구독 모델', '일회성 결제', '광고 수익', '중개 수수료']
        : ['Subscription model', 'One-time payment', 'Ad revenue', 'Commission fees']
    }
  ];

  const generateSmartQuestions = async () => {
    try {
      setIsLoading(true);
      console.log('Generating smart questions for idea:', initialIdea);

      const { data, error } = await supabase.functions.invoke('generate-smart-questions', {
        body: {
          ideaText: initialIdea,
          language: currentLanguage
        }
      });

      if (error) throw error;

      console.log('Generated smart questions:', data);

      if (data?.questions && data.questions.length > 0) {
        setSmartQuestions(data.questions);
      } else {
        console.log('No questions returned, using fallback');
        setSmartQuestions(fallbackQuestions);
      }
    } catch (error) {
      console.error('Error generating smart questions:', error);
      setSmartQuestions(fallbackQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 초기 환영 메시지
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'ai',
      content: `${text[currentLanguage].welcome}\n\n"${initialIdea}"`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    
    // AI 질문 생성
    generateSmartQuestions();
  }, []);

  useEffect(() => {
    if (smartQuestions.length > 0 && currentQuestionIndex === 0) {
      // 첫 번째 질문 시작
      setTimeout(() => {
        askCurrentQuestion();
      }, 1000);
    }
  }, [smartQuestions]);

  const askCurrentQuestion = () => {
    if (currentQuestionIndex < smartQuestions.length) {
      const question = smartQuestions[currentQuestionIndex];
      const questionMessage: ChatMessage = {
        id: `question-${currentQuestionIndex}`,
        role: 'ai',
        content: question.question,
        moduleType: question.moduleType,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
    }
  };

  const generateAIResponse = async (userAnswer: string, moduleType: string) => {
    try {
      setIsGeneratingQuestion(true);

      // Context for AI response generation
      const context = `
        Idea: ${initialIdea}
        Current module: ${moduleType}
        User answer: ${userAnswer}
        Previous modules: ${JSON.stringify(ideaData.modules)}
      `;

      console.log('Generating AI response for:', context);

      // Simple AI response for now - in a real implementation you'd call another edge function
      const encouragements = currentLanguage === 'ko' 
        ? ['정말 좋은 접근이네요!', '흥미로운 관점입니다!', '구체적이고 실용적이에요!', '혁신적인 생각이네요!', '시장에서 통할 것 같아요!']
        : ['Great approach!', 'Interesting perspective!', 'Concrete and practical!', 'Innovative thinking!', 'This could work in the market!'];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      
      return randomEncouragement;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return currentLanguage === 'ko' ? '좋습니다!' : 'Great!';
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleUserResponse = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // 현재 모듈에 답변 저장
    const currentQuestion = smartQuestions[currentQuestionIndex];
    if (currentQuestion) {
      setIdeaData(prev => ({
        ...prev,
        modules: {
          ...prev.modules,
          [currentQuestion.moduleType]: currentInput.trim()
        }
      }));
    }

    setCurrentInput('');

    // AI 응답 생성
    setIsLoading(true);
    const aiResponseText = await generateAIResponse(
      currentInput.trim(), 
      currentQuestion?.moduleType || 'general'
    );
    
    const aiResponse: ChatMessage = {
      id: `ai-response-${Date.now()}`,
      role: 'ai',
      content: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);

    // 다음 질문으로 이동
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    // 다음 질문 또는 완료
    setTimeout(() => {
      if (nextIndex < smartQuestions.length) {
        askCurrentQuestion();
      } else {
        // 모든 질문 완료
        const finalMessage: ChatMessage = {
          id: 'final',
          role: 'ai',
          content: currentLanguage === 'ko' 
            ? '와! 정말 구체적인 아이디어가 되었네요! 이제 AI가 종합 평가를 해드릴게요.' 
            : 'Wow! Your idea has become really concrete! Now AI will give you a comprehensive evaluation.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalMessage]);
      }
    }, 500);
  };

  const handleComplete = () => {
    onComplete({
      ...ideaData,
      chatHistory: messages,
      completionScore: (Object.keys(ideaData.modules).length / smartQuestions.length) * 10
    });
  };

  const handleSkip = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    if (nextIndex < smartQuestions.length) {
      setTimeout(askCurrentQuestion, 500);
    }
  };

  const handleSuggestedAnswer = (answer: string) => {
    setCurrentInput(answer);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserResponse();
    }
  };

  if (smartQuestions.length === 0 && isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {text[currentLanguage].loadingQuestions}
          </h3>
          <p className="text-gray-600">"{initialIdea}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
      {/* 진행률 표시 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            💡 아이디어 구체화 ({currentQuestionIndex}/{smartQuestions.length})
          </h3>
          <Button variant="ghost" onClick={onCancel} size="sm">
            ✕
          </Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentQuestionIndex / smartQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="p-6 max-h-96 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'ai' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {message.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              message.role === 'ai'
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800'
                : 'bg-gray-500 text-white'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        
        {(isLoading || isGeneratingQuestion) && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-2xl">
              <p className="text-sm text-gray-600">
                {isGeneratingQuestion ? text[currentLanguage].generatingQuestion : text[currentLanguage].analyzing}
              </p>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      {currentQuestionIndex < smartQuestions.length && (
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {currentQuestionIndex + 1}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestionIndex + 1}/{smartQuestions.length} 단계
            </span>
          </div>
          
          {/* 제안된 답변들 */}
          {smartQuestions[currentQuestionIndex]?.suggestedAnswers && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">💡 추천 답변:</p>
              <div className="flex flex-wrap gap-2">
                {smartQuestions[currentQuestionIndex].suggestedAnswers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedAnswer(answer)}
                    className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={text[currentLanguage].placeholder}
            className="w-full mb-4 min-h-[80px] resize-none border-2 border-purple-100 focus:border-purple-300"
            disabled={isLoading || isGeneratingQuestion}
          />
          
          <div className="flex space-x-3">
            <Button
              onClick={handleUserResponse}
              disabled={!currentInput.trim() || isLoading || isGeneratingQuestion}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {currentQuestionIndex === smartQuestions.length - 1 ? text[currentLanguage].completeButton : text[currentLanguage].nextButton}
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="px-6"
              disabled={isLoading || isGeneratingQuestion}
            >
              {text[currentLanguage].skipButton}
            </Button>
          </div>
        </div>
      )}

      {/* 완료 버튼 */}
      {currentQuestionIndex >= smartQuestions.length && (
        <div className="p-6 border-t border-gray-100 text-center">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 text-lg font-semibold"
          >
            🎉 AI 평가 받기
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveIdeaChat;
