
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Lightbulb, Loader2, ArrowRight, CheckCircle, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  moduleType?: string;
  timestamp: Date;
}

interface ModuleProgress {
  completeness: number;
  insights: string;
  needsMore: boolean;
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
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [moduleData, setModuleData] = useState<Record<string, string>>({});
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [conversationContext, setConversationContext] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [lastAskedModule, setLastAskedModule] = useState<string | null>(null);

  const moduleTypes = ['problem_definition', 'target_customer', 'value_proposition', 'revenue_model', 'competitive_advantage'];
  
  const text = {
    ko: {
      welcome: '안녕하세요! 흥미로운 아이디어네요! 🎉 함께 단계별로 더 구체적으로 발전시켜보겠습니다.',
      placeholder: '자세히 설명해주세요...',
      thinking: 'AI가 답변을 분석하고 더 자세한 질문을 준비 중...',
      completeButton: '완성! 평가받기',
      moduleNames: {
        problem_definition: '문제 정의',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        competitive_advantage: '경쟁 우위'
      },
      completeness: '완성도',
      continue: '계속하기'
    },
    en: {
      welcome: 'Hello! Interesting idea! 🎉 Let\'s develop it step by step together.',
      placeholder: 'Please explain in detail...',
      thinking: 'AI is analyzing your response and preparing more detailed questions...',
      completeButton: 'Complete! Get Evaluation',
      moduleNames: {
        problem_definition: 'Problem Definition',
        target_customer: 'Target Customer', 
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        competitive_advantage: 'Competitive Advantage'
      },
      completeness: 'Completeness',
      continue: 'Continue'
    }
  };

  // Check if message already exists to prevent duplication
  const messageExists = (content: string, role: 'user' | 'ai') => {
    return messages.some(msg => msg.content === content && msg.role === role);
  };

  // Add message only if it doesn't already exist
  const addMessage = (message: ChatMessage) => {
    if (!messageExists(message.content, message.role)) {
      console.log('Adding new message:', message.id, message.content.substring(0, 50) + '...');
      setMessages(prev => [...prev, message]);
    } else {
      console.log('Duplicate message prevented:', message.content.substring(0, 50) + '...');
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      console.log('Initializing chat with welcome message');
      
      // Initialize conversation with welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'ai',
        content: `${text[currentLanguage].welcome}\n\n"${initialIdea}"\n\n이제 하나씩 구체적으로 발전시켜보겠습니다!`,
        timestamp: new Date()
      };
      
      addMessage(welcomeMessage);
      setIsInitialized(true);
      
      // Start with first question
      setTimeout(() => {
        askNextQuestionForModule(0);
      }, 1000);
    }
  }, [isInitialized, initialIdea, currentLanguage]);

  const askNextQuestionForModule = async (moduleIndex: number) => {
    if (isAsking || moduleIndex >= moduleTypes.length) {
      if (moduleIndex >= moduleTypes.length) {
        handleCompletion();
      }
      return;
    }

    const targetModule = moduleTypes[moduleIndex];
    
    // Prevent asking for the same module twice in a row
    if (lastAskedModule === targetModule) {
      console.log('Skipping duplicate question for module:', targetModule);
      return;
    }

    setIsAsking(true);
    setLastAskedModule(targetModule);
    
    console.log('Asking question for module:', targetModule, 'at index:', moduleIndex);
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-smart-questions', {
        body: {
          ideaText: initialIdea,
          moduleType: targetModule,
          language: currentLanguage,
          context: conversationContext,
          previousAnswers: moduleData
        }
      });

      if (error) throw error;

      const question = data?.question;
      
      if (question) {
        const questionMessage: ChatMessage = {
          id: `question-${targetModule}-${Date.now()}`,
          role: 'ai',
          content: question,
          moduleType: targetModule,
          timestamp: new Date()
        };
        
        addMessage(questionMessage);
        console.log('Added API generated question for:', targetModule);
      } else {
        throw new Error('No question received from API');
      }
    } catch (error) {
      console.error('Error generating question for module:', targetModule, error);
      
      // Use fallback question for the specific module
      const fallbackQuestion = getDefaultQuestion(targetModule);
      const questionMessage: ChatMessage = {
        id: `fallback-${targetModule}-${Date.now()}`,
        role: 'ai',
        content: fallbackQuestion,
        moduleType: targetModule,
        timestamp: new Date()
      };
      
      addMessage(questionMessage);
      console.log('Added fallback question for:', targetModule);
    } finally {
      setIsLoading(false);
      setIsAsking(false);
    }
  };

  // Legacy function for backward compatibility - now redirects to the new function
  const askNextQuestion = () => {
    askNextQuestionForModule(currentModuleIndex);
  };

  const getDefaultQuestion = (moduleType: string): string => {
    const questions = {
      ko: {
        problem_definition: `"${initialIdea}"가 해결하려는 핵심 문제는 무엇인가요? 현재 사람들이 이 문제를 어떻게 해결하고 있는지, 왜 기존 방법이 불충분한지 구체적으로 설명해주세요.`,
        target_customer: '누가 이 솔루션을 가장 절실히 필요로 할까요? 그들의 나이, 직업, 생활패턴, 고민거리를 구체적으로 설명해주세요. 예를 들어 "30대 직장인 김씨는..." 같은 식으로요.',
        value_proposition: '기존 방식 대신 당신의 아이디어를 선택해야 하는 결정적인 이유는 무엇인가요? 시간, 비용, 편의성 등 구체적인 장점을 수치와 함께 설명해주세요.',
        revenue_model: '이 아이디어로 어떻게 지속가능한 수익을 만들어낼 수 있을까요? 누가 얼마를 지불할 의향이 있을지, 월간/연간 예상 매출은 얼마인지 설명해주세요.',
        competitive_advantage: '비슷한 아이디어나 경쟁업체가 있다면, 당신만의 차별화된 접근법은 무엇인가요? 왜 경쟁자들이 쉽게 따라할 수 없는지 설명해주세요.'
      },
      en: {
        problem_definition: `What core problem does "${initialIdea}" solve? Please explain specifically how people currently solve this problem and why existing methods are insufficient.`,
        target_customer: 'Who would most desperately need this solution? Please describe their age, occupation, lifestyle, and concerns in detail. For example, "30-year-old office worker Kim..."',
        value_proposition: 'What is the decisive reason to choose your idea over existing methods? Please explain specific advantages in terms of time, cost, convenience, etc. with numbers.',
        revenue_model: 'How can you generate sustainable revenue with this idea? Please explain who would be willing to pay how much, and what monthly/annual revenue you expect.',
        competitive_advantage: 'If similar ideas or competitors exist, what is your unique differentiated approach? Please explain why competitors cannot easily copy you.'
      }
    };
    
    return questions[currentLanguage][moduleType as keyof typeof questions[typeof currentLanguage]] || 'Please tell me more about this aspect.';
  };

  const analyzeResponse = async (userResponse: string, moduleType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-user-response', {
        body: {
          originalIdea: initialIdea,
          userAnswer: userResponse,
          moduleType: moduleType,
          conversationHistory: messages.slice(-5),
          language: currentLanguage
        }
      });

      if (error) throw error;

      const completeness = data?.completeness || 60;
      const insights = data?.insights || '좋은 시작입니다!';
      const needsMore = completeness < 75;

      return { completeness, insights, needsMore };
    } catch (error) {
      console.error('Error analyzing response:', error);
      
      // Fallback analysis based on length and keywords
      const completeness = userResponse.length > 100 ? 80 : userResponse.length > 50 ? 60 : 40;
      const insights = currentLanguage === 'ko' ? '더 구체적으로 설명해주시면 좋겠어요!' : 'Please provide more specific details!';
      const needsMore = completeness < 75;
      
      return { completeness, insights, needsMore };
    }
  };

  const proceedToNextModule = () => {
    console.log('Proceeding to next module from index:', currentModuleIndex, 'to:', currentModuleIndex + 1);
    
    const nextIndex = currentModuleIndex + 1;
    setCurrentModuleIndex(nextIndex);
    setLastAskedModule(null); // Reset to allow asking for the new module
    
    // Use setTimeout to ensure state has updated before asking next question
    setTimeout(() => {
      askNextQuestionForModule(nextIndex);
    }, 500);
  };

  const handleUserResponse = async () => {
    if (!currentInput.trim() || isCompleted || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    
    const currentModule = moduleTypes[currentModuleIndex];
    const userResponse = currentInput.trim();
    
    console.log('Processing user response for module:', currentModule, 'at index:', currentModuleIndex);
    
    // Save response to module data
    setModuleData(prev => ({
      ...prev,
      [currentModule]: userResponse
    }));

    // Update conversation context
    setConversationContext(prev => prev + `\n${currentModule}: ${userResponse}`);
    
    setCurrentInput('');
    setIsLoading(true);

    // Analyze response quality
    const analysis = await analyzeResponse(userResponse, currentModule);
    
    // Update progress
    setModuleProgress(prev => ({
      ...prev,
      [currentModule]: analysis
    }));

    if (analysis.needsMore) {
      // Ask follow-up question for better completion
      const followUpQuestion = await generateFollowUpQuestion(userResponse, currentModule, analysis.completeness);
      
      const followUpMessage: ChatMessage = {
        id: `followup-${Date.now()}`,
        role: 'ai',
        content: followUpQuestion,
        moduleType: currentModule,
        timestamp: new Date()
      };
      
      addMessage(followUpMessage);
    } else {
      // Module completed, move to next
      const completionMessage: ChatMessage = {
        id: `completion-${Date.now()}`,
        role: 'ai',
        content: `${analysis.insights} 이 부분은 완성되었습니다! 👏 다음 단계로 넘어가겠습니다.`,
        timestamp: new Date()
      };
      
      addMessage(completionMessage);
      
      // Move to next module after short delay
      setTimeout(() => {
        proceedToNextModule();
      }, 1500);
    }
    
    setIsLoading(false);
  };

  const generateFollowUpQuestion = async (userResponse: string, moduleType: string, completeness: number): Promise<string> => {
    // Generate contextual follow-up questions based on what's missing
    const followUpQuestions = {
      ko: {
        problem_definition: [
          '구체적인 예시나 상황을 하나 더 들어주실 수 있나요?',
          '이 문제로 인해 사람들이 실제로 어떤 손실이나 불편함을 겪고 있나요?',
          '현재 해결책들의 가장 큰 한계점은 무엇인가요?'
        ],
        target_customer: [
          '이런 고객들은 주로 어디서 시간을 보내나요? (온라인/오프라인)',
          '이들의 하루 일과 중 언제 이 문제를 가장 심각하게 느낄까요?',
          '비슷한 제품/서비스에 월평균 얼마나 지출하고 있을까요?'
        ],
        value_proposition: [
          '시간으로 따지면 얼마나 절약해줄 수 있나요?',
          '비용으로 따지면 어느 정도 절감 효과가 있을까요?',
          '감정적으로는 어떤 만족감이나 안도감을 줄 수 있나요?'
        ],
        revenue_model: [
          '고객 한 명당 예상 수익은 얼마 정도인가요?',
          '월 구독? 일회성 결제? 어떤 방식이 가장 적합할까요?',
          '초기에는 어떻게 고객을 확보할 계획인가요?'
        ],
        competitive_advantage: [
          '핵심 기술이나 노하우가 있다면 무엇인가요?',
          '특별한 파트너십이나 자원이 있나요?',
          '진입장벽을 어떻게 만들어낼 수 있을까요?'
        ]
      },
      en: {
        problem_definition: [
          'Can you provide one more specific example or situation?',
          'What actual losses or inconveniences do people experience due to this problem?',
          'What are the biggest limitations of current solutions?'
        ],
        target_customer: [
          'Where do these customers typically spend their time? (online/offline)',
          'When during their daily routine do they feel this problem most acutely?',
          'How much do they currently spend monthly on similar products/services?'
        ],
        value_proposition: [
          'In terms of time, how much can you save them?',
          'In terms of cost, what level of savings can you provide?',
          'Emotionally, what satisfaction or relief can you provide?'
        ],
        revenue_model: [
          'What is the expected revenue per customer?',
          'Monthly subscription? One-time payment? Which method is most suitable?',
          'How do you plan to acquire customers initially?'
        ],
        competitive_advantage: [
          'What core technology or know-how do you have?',
          'Do you have special partnerships or resources?',
          'How can you create barriers to entry?'
        ]
      }
    };

    const questions = followUpQuestions[currentLanguage][moduleType as keyof typeof followUpQuestions[typeof currentLanguage]];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const encouragement = currentLanguage === 'ko' 
      ? `좋은 답변이에요! (완성도 ${completeness}%) 조금만 더 구체적으로 설명해주시면 완벽해집니다. `
      : `Good answer! (${completeness}% complete) Just a bit more detail and it'll be perfect. `;
    
    return encouragement + randomQuestion;
  };

  const handleCompletion = () => {
    const finalMessage: ChatMessage = {
      id: 'final',
      role: 'ai',
      content: currentLanguage === 'ko' 
        ? '🎉 모든 단계가 완성되었습니다! 정말 훌륭한 아이디어로 발전시키셨네요. 이제 AI가 종합적인 평가를 진행하겠습니다.'
        : '🎉 All stages completed! You\'ve developed it into a truly excellent idea. Now AI will conduct a comprehensive evaluation.',
      timestamp: new Date()
    };
    
    addMessage(finalMessage);
    setIsCompleted(true);
  };

  const handleComplete = () => {
    const completionScore = Object.values(moduleProgress).reduce((acc, progress) => acc + progress.completeness, 0) / moduleTypes.length;
    
    onComplete({
      originalIdea: initialIdea,
      modules: moduleData,
      moduleProgress: moduleProgress,
      chatHistory: messages,
      conversationContext: conversationContext,
      completionScore: completionScore / 10
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentInput.trim()) {
        handleUserResponse();
      }
    }
  };

  const getCurrentModule = () => moduleTypes[currentModuleIndex];
  const totalProgress = (currentModuleIndex / moduleTypes.length) * 100;
  const currentModuleProgress = moduleProgress[getCurrentModule()]?.completeness || 0;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
      {/* Progress Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <span>AI 실시간 아이디어 코칭</span>
          </h3>
          <Button variant="ghost" onClick={onCancel} size="sm">
            ✕
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>전체 진행률</span>
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

      {/* Chat Messages */}
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
              {message.moduleType && (
                <div className="mt-2 text-xs opacity-75">
                  {text[currentLanguage].moduleNames[message.moduleType as keyof typeof text[typeof currentLanguage]['moduleNames']]}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-2xl">
              <p className="text-sm text-gray-600">
                {text[currentLanguage].thinking}
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

      {/* Input Area */}
      {!isCompleted && currentModuleIndex < moduleTypes.length && (
        <div className="p-6 border-t border-gray-100">
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={text[currentLanguage].placeholder}
            className="w-full mb-4 min-h-[120px] resize-none border-2 border-purple-100 focus:border-purple-300 text-base"
            disabled={isLoading}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentInput.length}/500
            </div>
            <Button
              onClick={handleUserResponse}
              disabled={!currentInput.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {text[currentLanguage].continue}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Completion Button */}
      {isCompleted && (
        <div className="p-6 border-t border-gray-100 text-center">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg font-semibold"
          >
            🎉 {text[currentLanguage].completeButton}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveIdeaChat;
