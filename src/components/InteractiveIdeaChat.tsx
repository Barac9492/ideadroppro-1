
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Lightbulb, Target, Wrench, DollarSign } from 'lucide-react';
import { generateSmartQuestions } from './SmartQuestionGenerator';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  moduleType?: string;
  timestamp: Date;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [ideaData, setIdeaData] = useState<any>({
    originalIdea: initialIdea,
    modules: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  const text = {
    ko: {
      welcome: '흥미로운 아이디어네요! 함께 구체화해볼까요?',
      steps: [
        { icon: <Lightbulb className="w-5 h-5" />, question: '이 아이디어가 어떤 문제를 해결하나요?', moduleType: 'problem' },
        { icon: <Target className="w-5 h-5" />, question: '누가 이 문제로 가장 힘들어할까요?', moduleType: 'target_customer' },
        { icon: <Wrench className="w-5 h-5" />, question: '이 문제를 어떤 방법으로 해결해주실 건가요?', moduleType: 'solution' },
        { icon: <DollarSign className="w-5 h-5" />, question: '어떻게 수익을 만들어낼 수 있을까요?', moduleType: 'revenue_model' }
      ],
      placeholder: '자유롭게 답변해주세요...',
      nextButton: '다음 단계',
      completeButton: '완성!',
      skipButton: '건너뛰기',
      thinking: 'AI가 생각 중...'
    },
    en: {
      welcome: 'Interesting idea! Shall we develop it together?',
      steps: [
        { icon: <Lightbulb className="w-5 h-5" />, question: 'What problem does this idea solve?', moduleType: 'problem' },
        { icon: <Target className="w-5 h-5" />, question: 'Who would suffer most from this problem?', moduleType: 'target_customer' },
        { icon: <Wrench className="w-5 h-5" />, question: 'How would you solve this problem?', moduleType: 'solution' },
        { icon: <DollarSign className="w-5 h-5" />, question: 'How could you generate revenue?', moduleType: 'revenue_model' }
      ],
      placeholder: 'Feel free to answer...',
      nextButton: 'Next Step',
      completeButton: 'Complete!',
      skipButton: 'Skip',
      thinking: 'AI is thinking...'
    }
  };

  const steps = text[currentLanguage].steps;

  useEffect(() => {
    // 초기 환영 메시지
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'ai',
      content: `${text[currentLanguage].welcome}\n\n"${initialIdea}"`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    
    // 첫 번째 질문 자동 시작
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  }, []);

  const askNextQuestion = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const questionMessage: ChatMessage = {
        id: `question-${currentStep}`,
        role: 'ai',
        content: step.question,
        moduleType: step.moduleType,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
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
    const currentModule = steps[currentStep]?.moduleType;
    if (currentModule) {
      setIdeaData(prev => ({
        ...prev,
        modules: {
          ...prev.modules,
          [currentModule]: currentInput.trim()
        }
      }));
    }

    setCurrentInput('');
    setCurrentStep(prev => prev + 1);

    // AI 응답 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      const encouragements = currentLanguage === 'ko' 
        ? ['좋아요!', '흥미롭네요!', '정말요?', '멋진 생각이에요!', '그럼요!']
        : ['Great!', 'Interesting!', 'Really?', 'Nice thinking!', 'Exactly!'];
      
      const aiResponse: ChatMessage = {
        id: `ai-response-${Date.now()}`,
        role: 'ai',
        content: encouragements[Math.floor(Math.random() * encouragements.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      // 다음 질문 또는 완료
      setTimeout(() => {
        if (currentStep + 1 < steps.length) {
          askNextQuestion();
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
    }, 1000);
  };

  const handleComplete = () => {
    onComplete({
      ...ideaData,
      chatHistory: messages
    });
  };

  const handleSkip = () => {
    setCurrentStep(prev => prev + 1);
    if (currentStep + 1 < steps.length) {
      setTimeout(askNextQuestion, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserResponse();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
      {/* 진행률 표시 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            💡 아이디어 구체화 ({currentStep}/{steps.length})
          </h3>
          <Button variant="ghost" onClick={onCancel} size="sm">
            ✕
          </Button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
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
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-2xl">
              <p className="text-sm text-gray-600">{text[currentLanguage].thinking}</p>
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
      {currentStep < steps.length && (
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            {steps[currentStep]?.icon}
            <span className="text-sm font-medium text-gray-600">
              {currentStep + 1}/{steps.length} 단계
            </span>
          </div>
          
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={text[currentLanguage].placeholder}
            className="w-full mb-4 min-h-[80px] resize-none border-2 border-purple-100 focus:border-purple-300"
          />
          
          <div className="flex space-x-3">
            <Button
              onClick={handleUserResponse}
              disabled={!currentInput.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {currentStep === steps.length - 1 ? text[currentLanguage].completeButton : text[currentLanguage].nextButton}
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="px-6"
            >
              {text[currentLanguage].skipButton}
            </Button>
          </div>
        </div>
      )}

      {/* 완료 버튼 */}
      {currentStep >= steps.length && (
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
