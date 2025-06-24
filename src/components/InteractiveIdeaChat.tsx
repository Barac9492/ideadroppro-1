
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import CompletionButton from './chat/CompletionButton';
import { useChatLogic } from '@/hooks/useChatLogic';
import { useQuestionGeneration } from '@/hooks/useQuestionGeneration';

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
  const [currentInput, setCurrentInput] = useState('');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const initializationRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const moduleTypes = ['problem_definition', 'target_customer', 'value_proposition', 'revenue_model', 'competitive_advantage'];
  
  const text = {
    ko: {
      welcome: '안녕하세요! 흥미로운 아이디어네요! 🎉 함께 단계별로 더 구체적으로 발전시켜보겠습니다.',
      error: '오류가 발생했습니다. 다시 시도해주세요.',
      retry: '다시 시도',
      processing: '처리 중...',
      networkError: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      continueAnyway: '계속 진행하기'
    },
    en: {
      welcome: 'Hello! Interesting idea! 🎉 Let\'s develop it step by step together.',
      error: 'An error occurred. Please try again.',
      retry: 'Retry',
      processing: 'Processing...',
      networkError: 'A network error occurred. Please try again later.',
      continueAnyway: 'Continue Anyway'
    }
  };

  const {
    messages,
    moduleData,
    moduleProgress,
    conversationContext,
    addMessage,
    analyzeResponse,
    generateFollowUpQuestion,
    setModuleData,
    setModuleProgress,
    setConversationContext
  } = useChatLogic(initialIdea, currentLanguage);

  const {
    askQuestionForModule,
    resetLastAskedModule,
    isAsking
  } = useQuestionGeneration(initialIdea, currentLanguage, conversationContext, moduleData, addMessage);

  // Auto-clear loading state after timeout
  useEffect(() => {
    if (isLoading || isAsking) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('⚠️ Loading timeout - auto-clearing loading states');
        setIsLoading(false);
        setError(currentLanguage === 'ko' ? '응답 시간이 초과되었습니다. 계속 진행하시겠습니까?' : 'Response timeout. Would you like to continue?');
        setDebugInfo(prev => prev + '\n[TIMEOUT] Loading cleared after 30s');
      }, 30000);
    } else {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, isAsking, currentLanguage]);

  // Enhanced initialization
  useEffect(() => {
    if (!initializationRef.current && initialIdea) {
      console.log('🚀 Initializing chat - ONE TIME ONLY');
      initializationRef.current = true;
      setDebugInfo('[INIT] Chat initialized');
      
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'ai',
        content: `${text[currentLanguage].welcome}\n\n"${initialIdea}"\n\n이제 하나씩 구체적으로 발전시켜보겠습니다!`,
        timestamp: new Date()
      };
      
      addMessage(welcomeMessage);
      
      setTimeout(() => {
        console.log('🎯 Asking FIRST question for module:', moduleTypes[0]);
        setDebugInfo(prev => prev + '\n[INIT] Asking first question');
        askQuestionForModule(moduleTypes[0]).catch(handleApiError);
      }, 1500);
    }
  }, []);

  const handleApiError = (error: Error) => {
    console.error('❌ API Error:', error);
    setIsLoading(false);
    setError(error.message || text[currentLanguage].networkError);
    setDebugInfo(prev => prev + `\n[ERROR] ${error.message}`);
    
    // Provide fallback to continue conversation
    const fallbackMessage: ChatMessage = {
      id: `error-recovery-${Date.now()}`,
      role: 'ai',
      content: currentLanguage === 'ko' 
        ? '죄송합니다. 일시적인 오류가 발생했습니다. 간단한 질문으로 계속 진행하겠습니다.'
        : 'Sorry, a temporary error occurred. Let me continue with a simple question.',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      addMessage(fallbackMessage);
      setError(null);
    }, 2000);
  };

  const proceedToNextModule = () => {
    console.log('➡️ Proceeding to next module from index:', currentModuleIndex, 'to:', currentModuleIndex + 1);
    setDebugInfo(prev => prev + `\n[PROGRESS] Moving to module ${currentModuleIndex + 1}`);
    
    const nextIndex = currentModuleIndex + 1;
    setCurrentModuleIndex(nextIndex);
    resetLastAskedModule();
    
    if (nextIndex >= moduleTypes.length) {
      handleCompletion();
      return;
    }
    
    // Ask next question with error handling
    setTimeout(() => {
      console.log('🎯 Asking NEXT question for module:', moduleTypes[nextIndex]);
      setDebugInfo(prev => prev + `\n[PROGRESS] Asking question for ${moduleTypes[nextIndex]}`);
      askQuestionForModule(moduleTypes[nextIndex]).catch(handleApiError);
    }, 1000);
  };

  const handleUserResponse = async () => {
    if (!currentInput.trim() || isCompleted) return;

    // Clear any existing errors
    setError(null);
    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    console.log('💬 Adding user message:', userMessage.id);
    setDebugInfo(prev => prev + `\n[USER] Message added: ${currentInput.substring(0, 30)}...`);
    addMessage(userMessage);
    
    const currentModule = moduleTypes[currentModuleIndex];
    const userResponse = currentInput.trim();
    
    console.log('🔄 Processing user response for module:', currentModule, 'at index:', currentModuleIndex);
    
    setModuleData(prev => ({
      ...prev,
      [currentModule]: userResponse
    }));

    setConversationContext(prev => prev + `\n${currentModule}: ${userResponse}`);
    setCurrentInput('');

    try {
      const analysis = await analyzeResponse(userResponse, currentModule);
      setDebugInfo(prev => prev + `\n[ANALYSIS] Completeness: ${analysis.completeness}%`);
      
      setModuleProgress(prev => ({
        ...prev,
        [currentModule]: analysis
      }));

      if (analysis.needsMore) {
        const followUpQuestion = await generateFollowUpQuestion(userResponse, currentModule, analysis.completeness);
        
        const followUpMessage: ChatMessage = {
          id: `followup-${currentModule}-${Date.now()}-${Math.random()}`,
          role: 'ai',
          content: followUpQuestion,
          moduleType: currentModule,
          timestamp: new Date()
        };
        
        console.log('❓ Adding follow-up question:', followUpMessage.id);
        setDebugInfo(prev => prev + '\n[FOLLOWUP] Follow-up question added');
        addMessage(followUpMessage);
      } else {
        const completionMessage: ChatMessage = {
          id: `completion-${currentModule}-${Date.now()}-${Math.random()}`,
          role: 'ai',
          content: `${analysis.insights} 이 부분은 완성되었습니다! 👏 다음 단계로 넘어가겠습니다.`,
          timestamp: new Date()
        };
        
        console.log('✅ Adding completion message:', completionMessage.id);
        setDebugInfo(prev => prev + '\n[COMPLETE] Module completed, proceeding to next');
        addMessage(completionMessage);
        
        setTimeout(() => {
          proceedToNextModule();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error in handleUserResponse:', error);
      handleApiError(error as Error);
      
      // Fallback: continue with basic response
      const basicResponse: ChatMessage = {
        id: `basic-${currentModule}-${Date.now()}`,
        role: 'ai',
        content: currentLanguage === 'ko' 
          ? '답변 감사합니다! 다음 질문으로 넘어가겠습니다.'
          : 'Thank you for your answer! Let me move to the next question.',
        timestamp: new Date()
      };
      
      setTimeout(() => {
        addMessage(basicResponse);
        proceedToNextModule();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletion = () => {
    const finalMessage: ChatMessage = {
      id: `final-${Date.now()}-${Math.random()}`,
      role: 'ai',
      content: currentLanguage === 'ko' 
        ? '🎉 모든 단계가 완성되었습니다! 정말 훌륭한 아이디어로 발전시키셨네요. 이제 AI가 종합적인 평가를 진행하겠습니다.'
        : '🎉 All stages completed! You\'ve developed it into a truly excellent idea. Now AI will conduct a comprehensive evaluation.',
      timestamp: new Date()
    };
    
    console.log('🏁 Adding final completion message:', finalMessage.id);
    setDebugInfo(prev => prev + '\n[FINAL] All modules completed');
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

  const handleRetry = () => {
    setError(null);
    setIsLoading(false);
    
    // Try to continue from current state
    if (currentModuleIndex < moduleTypes.length) {
      const retryMessage: ChatMessage = {
        id: `retry-${Date.now()}`,
        role: 'ai',
        content: currentLanguage === 'ko' 
          ? '다시 시도하겠습니다. 계속 진행해주세요!'
          : 'Let me try again. Please continue!',
        timestamp: new Date()
      };
      addMessage(retryMessage);
    }
  };

  const handleContinueAnyway = () => {
    setError(null);
    setIsLoading(false);
    
    // Force continue to next module or completion
    if (currentModuleIndex < moduleTypes.length - 1) {
      proceedToNextModule();
    } else {
      handleCompletion();
    }
  };

  const totalProgress = (currentModuleIndex / moduleTypes.length) * 100;
  const canSubmit = currentInput.trim() && !isLoading && !isAsking && currentModuleIndex < moduleTypes.length;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
      <ChatHeader
        currentLanguage={currentLanguage}
        onCancel={onCancel}
        totalProgress={totalProgress}
        moduleTypes={moduleTypes}
        moduleProgress={moduleProgress}
        currentModuleIndex={currentModuleIndex}
      />

      {/* Debug Info Display (only in development) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="p-2 bg-gray-100 text-xs font-mono text-gray-600 border-b">
          <details>
            <summary>Debug Info</summary>
            <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
          </details>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-1" />
              {text[currentLanguage].retry}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleContinueAnyway}>
              {text[currentLanguage].continueAnyway}
            </Button>
          </div>
        </div>
      )}

      <ChatMessages
        messages={messages}
        currentLanguage={currentLanguage}
        isLoading={isLoading || isAsking}
      />

      <ChatInput
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        onSubmit={handleUserResponse}
        isLoading={isLoading || isAsking}
        currentLanguage={currentLanguage}
        isCompleted={isCompleted}
        currentModuleIndex={currentModuleIndex}
        moduleTypesLength={moduleTypes.length}
        canSubmit={canSubmit}
      />

      <CompletionButton
        isCompleted={isCompleted}
        onComplete={handleComplete}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default InteractiveIdeaChat;
