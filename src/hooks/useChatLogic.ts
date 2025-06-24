
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

  const messageExists = useCallback((messageId: string, content: string, role: 'user' | 'ai') => {
    return messages.some(msg => 
      msg.id === messageId || 
      (msg.content === content && msg.role === role && Math.abs(Date.now() - msg.timestamp.getTime()) < 5000)
    );
  }, [messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    if (!messageExists(message.id, message.content, message.role)) {
      console.log('✅ Adding NEW message:', message.id, '- Content:', message.content.substring(0, 50) + '...');
      setMessages(prev => [...prev, message]);
    } else {
      console.log('🚫 BLOCKED duplicate message:', message.id, '- Content:', message.content.substring(0, 50) + '...');
    }
  }, [messageExists]);

  const analyzeResponse = async (userResponse: string, moduleType: string): Promise<ModuleProgress> => {
    try {
      console.log('🔍 Analyzing user response for module:', moduleType);
      
      const { data, error } = await supabase.functions.invoke('analyze-user-response', {
        body: {
          originalIdea: initialIdea,
          userAnswer: userResponse,
          moduleType: moduleType,
          conversationHistory: messages.slice(-5),
          language: currentLanguage
        }
      });

      if (error) {
        console.error('❌ Analysis API error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      const completeness = data?.completeness || Math.max(40, Math.min(80, userResponse.length > 100 ? 70 : userResponse.length > 50 ? 60 : 40));
      const insights = data?.insights || (currentLanguage === 'ko' ? '좋은 답변입니다!' : 'Good answer!');
      const needsMore = completeness < 75;

      console.log('✅ Analysis completed:', { completeness, needsMore });
      
      return { completeness, insights, needsMore };
    } catch (error) {
      console.error('❌ Error analyzing response:', error);
      
      // Provide intelligent fallback based on response content
      const wordCount = userResponse.split(/\s+/).length;
      const hasDetails = userResponse.includes('왜냐하면') || userResponse.includes('because') || userResponse.includes('예를 들어') || userResponse.includes('for example');
      const hasNumbers = /\d/.test(userResponse);
      
      let completeness = 40;
      if (wordCount > 50) completeness += 15;
      if (hasDetails) completeness += 15;
      if (hasNumbers) completeness += 10;
      if (userResponse.length > 200) completeness += 10;
      
      completeness = Math.min(completeness, 85); // Cap at 85% for fallback
      
      const insights = currentLanguage === 'ko' 
        ? `답변해주셔서 감사합니다! ${completeness > 70 ? '아주 좋은 설명이네요.' : '조금 더 구체적으로 설명해주시면 더욱 좋겠어요.'}`
        : `Thank you for your response! ${completeness > 70 ? 'That\'s a great explanation.' : 'Please provide a bit more detail if possible.'}`;
      
      const needsMore = completeness < 75;
      
      return { completeness, insights, needsMore };
    }
  };

  const generateFollowUpQuestion = async (userResponse: string, moduleType: string, completeness: number): Promise<string> => {
    // Enhanced fallback questions with more variety
    const followUpQuestions = {
      ko: {
        problem_definition: [
          '구체적인 예시나 상황을 하나 더 들어주실 수 있나요?',
          '이 문제로 인해 사람들이 실제로 어떤 손실이나 불편함을 겪고 있나요?',
          '현재 해결책들의 가장 큰 한계점은 무엇인가요?',
          '이 문제가 얼마나 자주 발생하는지 알려주세요.',
          '비슷한 경험을 하신 적이 있다면 자세히 설명해주세요.'
        ],
        target_customer: [
          '이런 고객들은 주로 어디서 시간을 보내나요? (온라인/오프라인)',
          '이들의 하루 일과 중 언제 이 문제를 가장 심각하게 느낄까요?',
          '비슷한 제품/서비스에 월평균 얼마나 지출하고 있을까요?',
          '이 고객들이 가장 중요하게 생각하는 가치는 무엇일까요?',
          '어떤 채널을 통해 이런 고객들을 만날 수 있을까요?'
        ],
        value_proposition: [
          '시간으로 따지면 얼마나 절약해줄 수 있나요?',
          '비용으로 따지면 어느 정도 절감 효과가 있을까요?',
          '감정적으로는 어떤 만족감이나 안도감을 줄 수 있나요?',
          '기존 방법과 비교했을 때 가장 큰 차이점은 무엇인가요?',
          '고객이 이 서비스를 사용한 후 어떤 변화를 느낄까요?'
        ],
        revenue_model: [
          '고객 한 명당 예상 수익은 얼마 정도인가요?',
          '월 구독? 일회성 결제? 어떤 방식이 가장 적합할까요?',
          '초기에는 어떻게 고객을 확보할 계획인가요?',
          '수익성을 위해 최소 몇 명의 고객이 필요할까요?',
          '추가 수익원이 될 수 있는 것들이 있을까요?'
        ],
        competitive_advantage: [
          '핵심 기술이나 노하우가 있다면 무엇인가요?',
          '특별한 파트너십이나 자원이 있나요?',
          '진입장벽을 어떻게 만들어낼 수 있을까요?',
          '경쟁사들이 따라하기 어려운 이유는 무엇인가요?',
          '장기적으로 경쟁우위를 유지하는 방법은 무엇일까요?'
        ]
      },
      en: {
        problem_definition: [
          'Can you provide one more specific example or situation?',
          'What actual losses or inconveniences do people experience due to this problem?',
          'What are the biggest limitations of current solutions?',
          'How often does this problem occur?',
          'If you\'ve had similar experiences, please describe them in detail.'
        ],
        target_customer: [
          'Where do these customers typically spend their time? (online/offline)',
          'When during their daily routine do they feel this problem most acutely?',
          'How much do they currently spend monthly on similar products/services?',
          'What values do these customers consider most important?',
          'Through which channels can you reach these customers?'
        ],
        value_proposition: [
          'In terms of time, how much can you save them?',
          'In terms of cost, what level of savings can you provide?',
          'Emotionally, what satisfaction or relief can you provide?',
          'What\'s the biggest difference compared to existing methods?',
          'What changes will customers feel after using this service?'
        ],
        revenue_model: [
          'What is the expected revenue per customer?',
          'Monthly subscription? One-time payment? Which method is most suitable?',
          'How do you plan to acquire customers initially?',
          'How many customers do you need at minimum for profitability?',
          'What additional revenue streams could there be?'
        ],
        competitive_advantage: [
          'What core technology or know-how do you have?',
          'Do you have special partnerships or resources?',
          'How can you create barriers to entry?',
          'Why would it be difficult for competitors to copy you?',
          'How will you maintain competitive advantage long-term?'
        ]
      }
    };

    try {
      // Try to generate a contextual follow-up question
      const questions = followUpQuestions[currentLanguage][moduleType as keyof typeof followUpQuestions[typeof currentLanguage]];
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      const encouragement = currentLanguage === 'ko' 
        ? `좋은 답변이에요! (완성도 ${completeness}%) 조금만 더 구체적으로 설명해주시면 완벽해집니다. `
        : `Good answer! (${completeness}% complete) Just a bit more detail and it'll be perfect. `;
      
      return encouragement + randomQuestion;
    } catch (error) {
      console.error('❌ Error generating follow-up question:', error);
      
      // Simple fallback
      return currentLanguage === 'ko' 
        ? '더 자세히 설명해주실 수 있나요?'
        : 'Could you please provide more details?';
    }
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
