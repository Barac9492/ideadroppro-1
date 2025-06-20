
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface GuideTipsProps {
  currentLanguage: 'ko' | 'en';
}

const GuideTips: React.FC<GuideTipsProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      tips: {
        title: '💡 사용 팁',
        tip1: '구체적이고 상세한 아이디어일수록 더 정확한 AI 분석을 받을 수 있습니다.',
        tip2: 'AI 평가에서 7점 이상을 받으면 실제 VC들의 전문가 조언을 받을 기회를 얻습니다.',
        tip3: '구체적인 비즈니스 모델과 수익 계획을 포함하면 더 높은 점수를 받을 수 있습니다.',
        tip4: '일일 프롬프트를 활용하여 새로운 아이디어 영감을 얻어보세요.'
      }
    },
    en: {
      tips: {
        title: '💡 Usage Tips',
        tip1: 'More specific and detailed ideas receive more accurate AI analysis.',
        tip2: 'Score 7+ points in AI evaluation to qualify for expert VC advice.',
        tip3: 'Include specific business models and revenue plans for higher scores.',
        tip4: 'Use daily prompts to get inspiration for new ideas.'
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl shadow-lg p-6 md:p-8 border border-yellow-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
        {text[currentLanguage].tips.title}
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-slate-700">{text[currentLanguage].tips.tip1}</p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-slate-700">{text[currentLanguage].tips.tip2}</p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-slate-700">{text[currentLanguage].tips.tip3}</p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-slate-700">{text[currentLanguage].tips.tip4}</p>
        </div>
      </div>
    </div>
  );
};

export default GuideTips;
