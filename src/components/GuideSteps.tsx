
import React from 'react';
import { Zap } from 'lucide-react';

interface GuideStepsProps {
  currentLanguage: 'ko' | 'en';
}

const GuideSteps: React.FC<GuideStepsProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      getStarted: '시작하기',
      steps: {
        step1: {
          title: '1. 회원가입 및 로그인',
          desc: '상단 우측의 "로그인" 버튼을 클릭하여 계정을 만들거나 로그인하세요.'
        },
        step2: {
          title: '2. 아이디어 제출',
          desc: '메인 페이지의 텍스트 상자에 여러분의 아이디어를 입력하고 "아이디어 제출" 버튼을 클릭하세요.'
        },
        step3: {
          title: '3. VC 기반 AI 1차 평가',
          desc: '제출된 아이디어 카드에서 "AI 분석 생성" 버튼을 클릭하여 현직 VC들의 평가 기준을 학습한 AI의 상세한 분석을 받아보세요.'
        },
        step4: {
          title: '4. 글로벌 시장 분석',
          desc: '"글로벌 분석 생성" 버튼으로 전 세계 시장에서의 아이디어 잠재력을 확인하세요.'
        },
        step5: {
          title: '5. VC 전문가 조언 자격 획득',
          desc: 'AI 평가에서 8점 이상을 받거나 월간 최다 하트를 받은 아이디어는 실제 VC들로부터 추가적인 전문가 조언을 받을 기회가 주어집니다.'
        },
        step6: {
          title: '6. 다른 아이디어와 소통',
          desc: '마음에 드는 아이디어에 좋아요를 누르고 다른 사용자들과 소통하세요. 월간 최다 하트를 받으면 VC 조언 자격을 얻을 수 있습니다!'
        },
        step7: {
          title: '7. 연속 제출로 스트릭 쌓기',
          desc: '매일 아이디어를 제출하여 연속 제출 기록을 쌓고 특별한 배지를 획득하세요.'
        }
      }
    },
    en: {
      getStarted: 'Get Started',
      steps: {
        step1: {
          title: '1. Sign Up & Login',
          desc: 'Click the "Sign In" button in the top right to create an account or log in.'
        },
        step2: {
          title: '2. Submit Ideas',
          desc: 'Enter your idea in the text box on the main page and click "Submit Idea".'
        },
        step3: {
          title: '3. VC-Based AI Initial Evaluation',
          desc: 'Click "Generate AI Analysis" on your idea card to receive detailed analysis from AI trained on real VC evaluation criteria.'
        },
        step4: {
          title: '4. Global Market Analysis',
          desc: 'Use "Generate Global Analysis" to check your idea\'s potential in global markets.'
        },
        step5: {
          title: '5. VC Expert Advice Qualification',
          desc: 'Ideas scoring 8+ points in AI evaluation OR receiving the most monthly hearts get additional expert advice from real VCs.'
        },
        step6: {
          title: '6. Engage with Community',
          desc: 'Like ideas you enjoy and engage with other users. Get the most monthly hearts to qualify for VC advice!'
        },
        step7: {
          title: '7. Build Streaks',
          desc: 'Submit ideas daily to build streaks and earn special badges.'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Zap className="h-6 w-6 mr-2 text-purple-600" />
        {text[currentLanguage].getStarted}
      </h2>
      
      <div className="space-y-6">
        {Object.values(text[currentLanguage].steps).map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
              <p className="text-slate-600">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideSteps;
