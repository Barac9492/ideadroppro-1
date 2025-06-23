import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
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
    modules: {},
    moduleProgress: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [smartQuestions, setSmartQuestions] = useState<SmartQuestion[]>([]);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [conversationContext, setConversationContext] = useState('');
  const [hasAskedCurrentQuestion, setHasAskedCurrentQuestion] = useState(false);

  const text = {
    ko: {
      welcome: '흥미로운 아이디어네요! AI가 단계별로 구체화를 도와드릴게요.',
      placeholder: '자세히 설명해주세요...',
      nextButton: '다음 단계',
      completeButton: '완성!',
      thinking: 'AI가 답변을 분석하고 있습니다...',
      generatingQuestion: 'AI가 다음 질문을 준비 중...',
      loadingQuestions: 'AI가 맞춤 질문들을 생성하고 있습니다...',
      errorGeneratingQuestions: '질문 생성 중 오류가 발생했습니다.',
      analyzing: 'AI가 답변을 분석하고 있습니다...'
    },
    en: {
      welcome: 'Interesting idea! AI will help you develop it step by step.',
      placeholder: 'Please explain in detail...',
      nextButton: 'Next Step',
      completeButton: 'Complete!',
      thinking: 'AI is analyzing your response...',
      generatingQuestion: 'AI is preparing the next question...',
      loadingQuestions: 'AI is generating customized questions...',
      errorGeneratingQuestions: 'Error generating questions.',
      analyzing: 'AI is analyzing your response...'
    }
  };

  const generateSmartQuestions = async () => {
    try {
      setIsLoading(true);
      console.log('Generating smart questions for idea:', initialIdea);

      const { data, error } = await supabase.functions.invoke('generate-smart-questions', {
        body: {
          ideaText: initialIdea,
          language: currentLanguage,
          context: 'initial'
        }
      });

      if (error) throw error;

      console.log('Generated smart questions:', data);

      if (data?.questions && data.questions.length > 0) {
        // 더 엄격한 중복 제거 로직
        const uniqueQuestions = data.questions.filter((question: SmartQuestion, index: number, arr: SmartQuestion[]) => {
          const normalizedQuestion = question.question.toLowerCase().trim();
          return arr.findIndex(q => q.question.toLowerCase().trim() === normalizedQuestion) === index;
        });
        
        // 각 모듈별로 하나씩만 선택
        const moduleMap = new Map<string, SmartQuestion>();
        uniqueQuestions.forEach((question: SmartQuestion) => {
          if (!moduleMap.has(question.moduleType)) {
            moduleMap.set(question.moduleType, question);
          }
        });
        
        const finalQuestions = Array.from(moduleMap.values()).slice(0, 5);
        setSmartQuestions(finalQuestions);
      } else {
        console.log('No questions returned, using fallback');
        setSmartQuestions(getFallbackQuestions());
      }
    } catch (error) {
      console.error('Error generating smart questions:', error);
      setSmartQuestions(getFallbackQuestions());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackQuestions = (): SmartQuestion[] => [
    {
      moduleType: 'problem_definition',
      question: currentLanguage === 'ko' 
        ? '이 아이디어가 해결하려는 핵심 문제는 무엇인가요? 현재 사람들이 이 문제를 어떻게 해결하고 있나요?'
        : 'What core problem does this idea solve? How are people currently addressing this problem?'
    },
    {
      moduleType: 'target_customer',
      question: currentLanguage === 'ko' 
        ? '누가 이 솔루션을 가장 절실히 필요로 할까요? 그들의 일상과 고민을 구체적으로 설명해보세요.'
        : 'Who would most desperately need this solution? Describe their daily life and concerns in detail.'
    },
    {
      moduleType: 'value_proposition',
      question: currentLanguage === 'ko' 
        ? '기존 방식 대신 당신의 아이디어를 선택해야 하는 결정적인 이유는 무엇인가요?'
        : 'What is the decisive reason to choose your idea over existing methods?'
    },
    {
      moduleType: 'revenue_model',
      question: currentLanguage === 'ko' 
        ? '이 아이디어로 어떻게 지속 가능한 수익을 만들어낼 수 있을까요?'
        : 'How can you generate sustainable revenue with this idea?'
    },
    {
      moduleType: 'competitive_advantage',
      question: currentLanguage === 'ko' 
        ? '비슷한 아이디어가 이미 존재한다면, 당신만의 차별화된 접근법은 무엇인가요?'
        : 'If similar ideas already exist, what is your unique differentiated approach?'
    }
  ];

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'ai',
      content: `${text[currentLanguage].welcome}\n\n"${initialIdea}"`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    generateSmartQuestions();
  }, []);

  useEffect(() => {
    if (smartQuestions.length > 0 && currentQuestionIndex === 0 && !hasAskedCurrentQuestion) {
      setTimeout(() => {
        askCurrentQuestion();
      }, 1000);
    }
  }, [smartQuestions, currentQuestionIndex, hasAskedCurrentQuestion]);

  const askCurrentQuestion = () => {
    if (currentQuestionIndex < smartQuestions.length && !hasAskedCurrentQuestion) {
      const question = smartQuestions[currentQuestionIndex];
      const questionMessage: ChatMessage = {
        id: `question-${currentQuestionIndex}-${Date.now()}`,
        role: 'ai',
        content: question.question,
        moduleType: question.moduleType,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setHasAskedCurrentQuestion(true);
    }
  };

  const generateContextualAIResponse = async (userAnswer: string, moduleType: string) => {
    try {
      setIsGeneratingQuestion(true);

      const { data, error } = await supabase.functions.invoke('analyze-user-response', {
        body: {
          originalIdea: initialIdea,
          userAnswer: userAnswer,
          moduleType: moduleType,
          conversationHistory: messages,
          language: currentLanguage
        }
      });

      if (error) throw error;

      const insights = data?.insights || (currentLanguage === 'ko' ? '좋은 접근입니다!' : 'Good approach!');
      const completeness = data?.completeness || 70;
      
      // Update module progress
      setIdeaData(prev => ({
        ...prev,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleType]: { completeness, insights }
        }
      }));

      return insights;
    } catch (error) {
      console.error('Error generating AI response:', error);
      const fallbackResponses = currentLanguage === 'ko' 
        ? ['흥미로운 관점이네요!', '구체적이고 실용적입니다!', '창의적인 접근이에요!', '시장성이 있어 보입니다!']
        : ['Interesting perspective!', 'Concrete and practical!', 'Creative approach!', 'Looks marketable!'];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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

    // Save answer to current module
    const currentQuestion = smartQuestions[currentQuestionIndex];
    if (currentQuestion) {
      setIdeaData(prev => ({
        ...prev,
        modules: {
          ...prev.modules,
          [currentQuestion.moduleType]: currentInput.trim()
        }
      }));

      // Update conversation context
      setConversationContext(prev => prev + `\n${currentQuestion.moduleType}: ${currentInput.trim()}`);
    }

    setCurrentInput('');

    // Generate contextual AI response
    setIsLoading(true);
    const aiResponseText = await generateContextualAIResponse(
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

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setHasAskedCurrentQuestion(false);

    // Ask next question or complete
    setTimeout(() => {
      if (nextIndex < smartQuestions.length) {
        askCurrentQuestion();
      } else {
        // All questions completed
        const finalMessage: ChatMessage = {
          id: 'final',
          role: 'ai',
          content: currentLanguage === 'ko' 
            ? '완벽합니다! 이제 AI가 종합적인 평가를 진행하겠습니다.' 
            : 'Perfect! Now AI will conduct a comprehensive evaluation.',
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
      conversationContext: conversationContext,
      completionScore: (Object.keys(ideaData.modules).length / smartQuestions.length) * 10
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserResponse();
    }
  };

  if (smartQuestions.length === 0 && isLoading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
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
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
      {/* Progress indicator */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            💡 아이디어 구체화 ({currentQuestionIndex}/{smartQuestions.length})
          </h3>
          <Button variant="ghost" onClick={onCancel} size="sm">
            ✕
          </Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${(currentQuestionIndex / smartQuestions.length) * 100}%` }}
          />
        </div>
        
        {/* Module completion status */}
        {Object.keys(ideaData.modules).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(ideaData.moduleProgress || {}).map(([moduleType, progress]: [string, any]) => (
              <div key={moduleType} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {moduleType.replace('_', ' ')} ✓
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="p-6 max-h-96 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              message.role === 'ai' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {message.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={`max-w-md px-4 py-3 rounded-2xl ${
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-2xl">
              <p className="text-sm text-gray-600">
                {text[currentLanguage].analyzing}
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

      {/* Input area */}
      {currentQuestionIndex < smartQuestions.length && (
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {currentQuestionIndex + 1}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestionIndex + 1}/{smartQuestions.length} 단계
            </span>
          </div>
          
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={text[currentLanguage].placeholder}
            className="w-full mb-4 min-h-[120px] resize-none border-2 border-purple-100 focus:border-purple-300 text-base"
            disabled={isLoading || isGeneratingQuestion}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleUserResponse}
              disabled={!currentInput.trim() || isLoading || isGeneratingQuestion}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {currentQuestionIndex === smartQuestions.length - 1 ? text[currentLanguage].completeButton : text[currentLanguage].nextButton}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Complete button */}
      {currentQuestionIndex >= smartQuestions.length && (
        <div className="p-6 border-t border-gray-100 text-center">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg font-semibold"
          >
            🎉 AI 종합 평가 받기
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveIdeaChat;
