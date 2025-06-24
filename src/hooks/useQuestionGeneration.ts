
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  moduleType?: string;
  timestamp: Date;
}

export const useQuestionGeneration = (
  initialIdea: string,
  currentLanguage: 'ko' | 'en',
  conversationContext: string,
  moduleData: Record<string, string>,
  addMessage: (message: ChatMessage) => void
) => {
  const [isAsking, setIsAsking] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<string>('');
  const lastAskedModuleRef = useRef<string | null>(null);
  const processingRef = useRef<Set<string>>(new Set());
  const retryCountRef = useRef<Record<string, number>>({});

  const getDefaultQuestion = useCallback((moduleType: string): string => {
    const questions = {
      ko: {
        problem_definition: `"${initialIdea}"가 해결하려는 핵심 문제는 무엇인가요? 현재 사람들이 이 문제를 어떻게 해결하고 있는지, 왜 기존 방법이 불충분한지 구체적으로 설명해주세요.`,
        target_customer: '누가 이 솔루션을 가장 절실히 필요로 할까요? 그들의 나이, 직업, 생활패턴, 고민거리를 구체적으로 설명해주세요.',
        value_proposition: '기존 방식 대신 당신의 아이디어를 선택해야 하는 결정적인 이유는 무엇인가요? 시간, 비용, 편의성 등 구체적인 장점을 수치와 함께 설명해주세요.',
        revenue_model: '이 아이디어로 어떻게 지속가능한 수익을 만들어낼 수 있을까요? 누가 얼마를 지불할 의향이 있을지, 월간/연간 예상 매출은 얼마인지 설명해주세요.',
        competitive_advantage: '비슷한 아이디어나 경쟁업체가 있다면, 당신만의 차별화된 접근법은 무엇인가요? 왜 경쟁자들이 쉽게 따라할 수 없는지 설명해주세요.'
      },
      en: {
        problem_definition: `What core problem does "${initialIdea}" solve? Please explain specifically how people currently solve this problem and why existing methods are insufficient.`,
        target_customer: 'Who would most desperately need this solution? Please describe their age, occupation, lifestyle, and concerns in detail.',
        value_proposition: 'What is the decisive reason to choose your idea over existing methods? Please explain specific advantages in terms of time, cost, convenience, etc. with numbers.',
        revenue_model: 'How can you generate sustainable revenue with this idea? Please explain who would be willing to pay how much, and what monthly/annual revenue you expect.',
        competitive_advantage: 'If similar ideas or competitors exist, what is your unique differentiated approach? Please explain why competitors cannot easily copy you.'
      }
    };
    
    return questions[currentLanguage][moduleType as keyof typeof questions[typeof currentLanguage]] || 'Please tell me more about this aspect.';
  }, [initialIdea, currentLanguage]);

  const askQuestionForModule = useCallback(async (moduleType: string): Promise<void> => {
    if (isAsking || 
        lastAskedModuleRef.current === moduleType || 
        processingRef.current.has(moduleType)) {
      return Promise.resolve();
    }

    setIsAsking(true);
    setCurrentProcess(currentLanguage === 'ko' ? 'AI가 맞춤형 질문을 생성 중...' : 'AI is generating personalized question...');
    lastAskedModuleRef.current = moduleType;
    processingRef.current.add(moduleType);
    
    if (!retryCountRef.current[moduleType]) {
      retryCountRef.current[moduleType] = 0;
    }
    
    try {
      // Shortened timeout for better UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced from 30s to 8s

      const { data, error } = await supabase.functions.invoke('generate-smart-questions', {
        body: {
          ideaText: initialIdea,
          moduleType: moduleType,
          language: currentLanguage,
          context: conversationContext,
          previousAnswers: moduleData
        }
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(`API Error: ${error.message || 'Unknown error'}`);
      }

      const question = data?.question;
      
      if (question) {
        const questionMessage: ChatMessage = {
          id: `api-question-${moduleType}-${Date.now()}-${Math.random()}`,
          role: 'ai',
          content: question,
          moduleType: moduleType,
          timestamp: new Date()
        };
        
        addMessage(questionMessage);
        retryCountRef.current[moduleType] = 0;
      } else {
        throw new Error('No question received from API');
      }
    } catch (error) {
      console.error('Error generating question for module:', moduleType, error);
      
      retryCountRef.current[moduleType]++;
      
      // Use fallback immediately after first failure for better UX
      if (retryCountRef.current[moduleType] >= 1) {
        setCurrentProcess(currentLanguage === 'ko' ? '기본 질문으로 진행 중...' : 'Using default question...');
        
        const fallbackQuestion = getDefaultQuestion(moduleType);
        const questionMessage: ChatMessage = {
          id: `fallback-question-${moduleType}-${Date.now()}-${Math.random()}`,
          role: 'ai',
          content: fallbackQuestion,
          moduleType: moduleType,
          timestamp: new Date()
        };
        
        addMessage(questionMessage);
        retryCountRef.current[moduleType] = 0;
      }
    } finally {
      processingRef.current.delete(moduleType);
      setIsAsking(false);
      setCurrentProcess('');
    }
    
    return Promise.resolve();
  }, [isAsking, initialIdea, currentLanguage, conversationContext, moduleData, addMessage, getDefaultQuestion]);

  const resetLastAskedModule = useCallback(() => {
    lastAskedModuleRef.current = null;
    processingRef.current.clear();
    setIsAsking(false);
    setCurrentProcess('');
  }, []);

  return {
    askQuestionForModule,
    resetLastAskedModule,
    isAsking,
    currentProcess
  };
};
