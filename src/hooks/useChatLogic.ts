
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useChatLogic = (
  initialIdea: string,
  currentLanguage: 'ko' | 'en'
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [moduleData, setModuleData] = useState<Record<string, string>>({});
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [conversationContext, setConversationContext] = useState('');

  const messageExists = useCallback((content: string, role: 'user' | 'ai') => {
    return messages.some(msg => msg.content === content && msg.role === role);
  }, [messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    if (!messageExists(message.content, message.role)) {
      console.log('Adding new message:', message.id, message.content.substring(0, 50) + '...');
      setMessages(prev => [...prev, message]);
    } else {
      console.log('Duplicate message prevented:', message.content.substring(0, 50) + '...');
    }
  }, [messageExists]);

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
      
      const completeness = userResponse.length > 100 ? 80 : userResponse.length > 50 ? 60 : 40;
      const insights = currentLanguage === 'ko' ? '더 구체적으로 설명해주시면 좋겠어요!' : 'Please provide more specific details!';
      const needsMore = completeness < 75;
      
      return { completeness, insights, needsMore };
    }
  };

  const generateFollowUpQuestion = async (userResponse: string, moduleType: string, completeness: number): Promise<string> => {
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

  return {
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
  };
};
