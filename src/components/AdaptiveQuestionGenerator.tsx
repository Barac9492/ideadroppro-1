
import { IdeaQuality } from './IdeaQualityAnalyzer';

interface AdaptiveQuestion {
  moduleType: string;
  question: string;
  educationalTip?: string;
  followUpQuestions?: string[];
}

export const generateAdaptiveQuestions = async (
  idea: string, 
  qualityAnalysis: IdeaQuality, 
  language: 'ko' | 'en'
): Promise<AdaptiveQuestion[]> => {
  
  const baseQuestions = language === 'ko' ? {
    basic: [
      {
        moduleType: 'problem_definition',
        question: `"${idea}"로 어떤 불편함이나 문제를 해결하려고 하나요? 일상에서 겪는 구체적인 상황을 설명해보세요.`,
        educationalTip: '좋은 아이디어는 실제 문제에서 시작됩니다.',
        followUpQuestions: ['언제 이 문제를 느끼나요?', '얼마나 자주 발생하나요?']
      },
      {
        moduleType: 'target_customer',
        question: `누가 이 문제로 가장 힘들어할까요? 나이, 직업, 상황 등을 구체적으로 생각해보세요.`,
        educationalTip: '타겟이 명확할수록 해결책도 명확해집니다.',
        followUpQuestions: ['그들은 보통 어디에 있나요?', '무엇을 중요하게 생각하나요?']
      },
      {
        moduleType: 'value_proposition',
        question: `기존 방법 대신 "${idea}"를 선택해야 하는 특별한 이유가 있나요?`,
        educationalTip: '차별화된 가치가 성공의 열쇠입니다.',
        followUpQuestions: ['어떤 점이 더 편리한가요?', '시간이나 비용을 절약할 수 있나요?']
      }
    ],
    intermediate: [
      {
        moduleType: 'problem_definition',
        question: `"${idea}"가 해결하려는 핵심 문제는 무엇인가요? 이 문제의 근본 원인은 무엇일까요?`,
        followUpQuestions: ['이 문제가 해결되지 않으면 어떤 결과가 생기나요?']
      },
      {
        moduleType: 'target_customer',
        question: `누가 이 문제를 가장 절실하게 느끼고 있나요? 그들의 구체적인 상황과 특성을 설명해보세요.`,
        followUpQuestions: ['이들의 구매 결정 요인은 무엇인가요?']
      },
      {
        moduleType: 'value_proposition',
        question: `기존 해결책과 비교했을 때 "${idea}"의 독특한 가치는 무엇인가요?`,
        followUpQuestions: ['어떤 측면에서 10배 더 좋은가요?']
      },
      {
        moduleType: 'revenue_model',
        question: `"${idea}"로 어떻게 지속 가능한 수익을 만들 수 있을까요?`
      }
    ],
    advanced: [
      {
        moduleType: 'problem_definition',
        question: `"${idea}"가 해결하려는 문제의 시장 규모와 심각성은 어느 정도인가요?`
      },
      {
        moduleType: 'target_customer',
        question: `"${idea}"의 핵심 타겟 고객의 페르소나와 고객 여정을 상세히 설명해보세요.`
      },
      {
        moduleType: 'value_proposition',
        question: `"${idea}"의 핵심 가치 제안과 경쟁 우위 요소는 무엇인가요?`
      },
      {
        moduleType: 'revenue_model',
        question: `"${idea}"의 수익 모델과 예상 단위 경제성은 어떻게 되나요?`
      },
      {
        moduleType: 'competitive_advantage',
        question: `"${idea}"의 지속 가능한 경쟁 우위와 시장 진입 장벽은 무엇인가요?`
      }
    ]
  } : {
    basic: [
      {
        moduleType: 'problem_definition',
        question: `What problem or inconvenience does "${idea}" solve? Describe a specific situation from daily life.`,
        educationalTip: 'Great ideas start with real problems.',
        followUpQuestions: ['When do you notice this problem?', 'How often does it occur?']
      },
      {
        moduleType: 'target_customer',
        question: `Who would struggle most with this problem? Think specifically about age, occupation, situation.`,
        educationalTip: 'The clearer the target, the clearer the solution.',
        followUpQuestions: ['Where are they usually found?', 'What do they value most?']
      },
      {
        moduleType: 'value_proposition',
        question: `Is there a special reason to choose "${idea}" over existing methods?`,
        educationalTip: 'Differentiated value is the key to success.',
        followUpQuestions: ['What makes it more convenient?', 'Can it save time or money?']
      }
    ],
    intermediate: [
      {
        moduleType: 'problem_definition',
        question: `What is the core problem that "${idea}" solves? What is the root cause of this problem?`,
        followUpQuestions: ['What happens if this problem remains unsolved?']
      },
      {
        moduleType: 'target_customer',
        question: `Who feels this problem most desperately? Describe their specific situation and characteristics.`,
        followUpQuestions: ['What are their purchase decision factors?']
      },
      {
        moduleType: 'value_proposition',
        question: `What is the unique value of "${idea}" compared to existing solutions?`,
        followUpQuestions: ['In what aspect is it 10x better?']
      },
      {
        moduleType: 'revenue_model',
        question: `How can "${idea}" generate sustainable revenue?`
      }
    ],
    advanced: [
      {
        moduleType: 'problem_definition',
        question: `What is the market size and severity of the problem that "${idea}" solves?`
      },
      {
        moduleType: 'target_customer',
        question: `Describe in detail the persona and customer journey of "${idea}"'s core target customers.`
      },
      {
        moduleType: 'value_proposition',
        question: `What are the core value proposition and competitive advantages of "${idea}"?`
      },
      {
        moduleType: 'revenue_model',
        question: `What is the revenue model and expected unit economics of "${idea}"?`
      },
      {
        moduleType: 'competitive_advantage',
        question: `What are the sustainable competitive advantages and market entry barriers for "${idea}"?`
      }
    ]
  };

  return baseQuestions[qualityAnalysis.level];
};
