
import { useState, useCallback } from 'react';
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
  const [lastAskedModule, setLastAskedModule] = useState<string | null>(null);

  const getDefaultQuestion = useCallback((moduleType: string): string => {
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
  }, [initialIdea, currentLanguage]);

  const askQuestionForModule = useCallback(async (moduleType: string) => {
    if (isAsking || lastAskedModule === moduleType) {
      console.log('Skipping duplicate or concurrent question for module:', moduleType);
      return;
    }

    setIsAsking(true);
    setLastAskedModule(moduleType);
    
    console.log('Asking question for module:', moduleType);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-smart-questions', {
        body: {
          ideaText: initialIdea,
          moduleType: moduleType,
          language: currentLanguage,
          context: conversationContext,
          previousAnswers: moduleData
        }
      });

      if (error) throw error;

      const question = data?.question;
      
      if (question) {
        const questionMessage: ChatMessage = {
          id: `question-${moduleType}-${Date.now()}`,
          role: 'ai',
          content: question,
          moduleType: moduleType,
          timestamp: new Date()
        };
        
        addMessage(questionMessage);
        console.log('Added API generated question for:', moduleType);
      } else {
        throw new Error('No question received from API');
      }
    } catch (error) {
      console.error('Error generating question for module:', moduleType, error);
      
      const fallbackQuestion = getDefaultQuestion(moduleType);
      const questionMessage: ChatMessage = {
        id: `fallback-${moduleType}-${Date.now()}`,
        role: 'ai',
        content: fallbackQuestion,
        moduleType: moduleType,
        timestamp: new Date()
      };
      
      addMessage(questionMessage);
      console.log('Added fallback question for:', moduleType);
    } finally {
      setIsAsking(false);
    }
  }, [isAsking, lastAskedModule, initialIdea, currentLanguage, conversationContext, moduleData, addMessage, getDefaultQuestion]);

  const resetLastAskedModule = useCallback(() => {
    setLastAskedModule(null);
  }, []);

  return {
    askQuestionForModule,
    resetLastAskedModule,
    isAsking
  };
};
