
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const [isInitialized, setIsInitialized] = useState(false);

  const moduleTypes = ['problem_definition', 'target_customer', 'value_proposition', 'revenue_model', 'competitive_advantage'];
  
  const text = {
    ko: {
      welcome: '안녕하세요! 흥미로운 아이디어네요! 🎉 함께 단계별로 더 구체적으로 발전시켜보겠습니다.',
    },
    en: {
      welcome: 'Hello! Interesting idea! 🎉 Let\'s develop it step by step together.',
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

  useEffect(() => {
    if (!isInitialized) {
      console.log('Initializing chat with welcome message');
      
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'ai',
        content: `${text[currentLanguage].welcome}\n\n"${initialIdea}"\n\n이제 하나씩 구체적으로 발전시켜보겠습니다!`,
        timestamp: new Date()
      };
      
      addMessage(welcomeMessage);
      setIsInitialized(true);
      
      setTimeout(() => {
        askQuestionForModule(moduleTypes[0]);
      }, 1000);
    }
  }, [isInitialized, initialIdea, currentLanguage, addMessage, askQuestionForModule, moduleTypes, text]);

  const proceedToNextModule = () => {
    console.log('Proceeding to next module from index:', currentModuleIndex, 'to:', currentModuleIndex + 1);
    
    const nextIndex = currentModuleIndex + 1;
    setCurrentModuleIndex(nextIndex);
    resetLastAskedModule();
    
    if (nextIndex >= moduleTypes.length) {
      handleCompletion();
      return;
    }
    
    setTimeout(() => {
      askQuestionForModule(moduleTypes[nextIndex]);
    }, 500);
  };

  const handleUserResponse = async () => {
    if (!currentInput.trim() || isCompleted || isLoading) return;

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
    
    setModuleData(prev => ({
      ...prev,
      [currentModule]: userResponse
    }));

    setConversationContext(prev => prev + `\n${currentModule}: ${userResponse}`);
    
    setCurrentInput('');
    setIsLoading(true);

    const analysis = await analyzeResponse(userResponse, currentModule);
    
    setModuleProgress(prev => ({
      ...prev,
      [currentModule]: analysis
    }));

    if (analysis.needsMore) {
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
      const completionMessage: ChatMessage = {
        id: `completion-${Date.now()}`,
        role: 'ai',
        content: `${analysis.insights} 이 부분은 완성되었습니다! 👏 다음 단계로 넘어가겠습니다.`,
        timestamp: new Date()
      };
      
      addMessage(completionMessage);
      
      setTimeout(() => {
        proceedToNextModule();
      }, 1500);
    }
    
    setIsLoading(false);
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

  const totalProgress = (currentModuleIndex / moduleTypes.length) * 100;

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
