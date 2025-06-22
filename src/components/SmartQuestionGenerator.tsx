
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuestionGeneratorProps {
  ideaText: string;
  currentLanguage: 'ko' | 'en';
  onQuestionsGenerated: (questions: any[]) => void;
}

export const generateSmartQuestions = async (
  ideaText: string, 
  currentLanguage: 'ko' | 'en'
): Promise<any[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-smart-questions', {
      body: { ideaText, language: currentLanguage }
    });

    if (error) throw error;

    return data.questions || [];
  } catch (error) {
    console.error('Error generating smart questions:', error);
    
    // Fallback questions
    const fallbackQuestions = currentLanguage === 'ko' ? [
      {
        moduleType: 'problem',
        question: '이 아이디어가 해결하려는 핵심 문제는 무엇인가요?',
        suggestedAnswers: ['효율성 문제', '비용 문제', '접근성 문제', '시간 문제']
      },
      {
        moduleType: 'target_customer',
        question: '주요 고객층은 누구인가요?',
        suggestedAnswers: ['개인 사용자', '기업 고객', '정부 기관', '교육 기관']
      },
      {
        moduleType: 'value_proposition',
        question: '고객에게 제공하는 핵심 가치는 무엇인가요?',
        suggestedAnswers: ['시간 절약', '비용 절감', '편의성', '품질 향상']
      }
    ] : [
      {
        moduleType: 'problem',
        question: 'What core problem does this idea solve?',
        suggestedAnswers: ['Efficiency issues', 'Cost problems', 'Accessibility issues', 'Time constraints']
      },
      {
        moduleType: 'target_customer',
        question: 'Who is your main customer segment?',
        suggestedAnswers: ['Individual users', 'Enterprise clients', 'Government agencies', 'Educational institutions']
      },
      {
        moduleType: 'value_proposition',
        question: 'What core value do you provide to customers?',
        suggestedAnswers: ['Time saving', 'Cost reduction', 'Convenience', 'Quality improvement']
      }
    ];

    return fallbackQuestions;
  }
};
