
import React from 'react';
import { Lightbulb, Shield, Target } from 'lucide-react';

interface GuideTipsProps {
  currentLanguage: 'ko' | 'en';
}

const GuideTips: React.FC<GuideTipsProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      tips: {
        title: '💡 사용 팁',
        tip1: '구체적이고 상세한 아이디어일수록 더 정확한 AI 분석을 받을 수 있습니다.',
        tip2: 'AI 평가에서 8.5점 이상을 받으면 실제 VC들의 전문가 조언을 받을 기회를 얻습니다. (극히 소수의 최우수 아이디어만 해당)',
        tip3: '구체적인 비즈니스 모델과 수익 계획을 포함하면 더 높은 점수를 받을 수 있습니다.',
        tip4: '일일 프롬프트를 활용하여 새로운 아이디어 영감을 얻어보세요.',
        qualityTitle: '🎯 고품질 아이디어 작성 가이드',
        quality1: '문제와 해결책을 명확히 정의하세요',
        quality2: '타겟 고객과 시장 규모를 구체적으로 제시하세요',
        quality3: '경쟁사 대비 차별화 포인트를 명시하세요',
        quality4: '실현 가능한 수익 모델을 포함하세요',
        fairPlayTitle: '🛡️ 공정한 평가를 위한 안내',
        fairPlay1: '중복 제출이나 유사한 아이디어 반복 제출은 제한됩니다',
        fairPlay2: '하루에 제한된 횟수만 AI 분석을 요청할 수 있습니다',
        fairPlay3: '시스템 남용이 감지되면 서비스 이용이 제한될 수 있습니다'
      }
    },
    en: {
      tips: {
        title: '💡 Usage Tips',
        tip1: 'More specific and detailed ideas receive more accurate AI analysis.',
        tip2: 'Score 8.5+ points in AI evaluation to qualify for expert VC advice. (Only for exceptional ideas)',
        tip3: 'Include specific business models and revenue plans for higher scores.',
        tip4: 'Use daily prompts to get inspiration for new ideas.',
        qualityTitle: '🎯 High-Quality Idea Writing Guide',
        quality1: 'Clearly define the problem and solution',
        quality2: 'Specify target customers and market size',
        quality3: 'Highlight differentiation points vs competitors',
        quality4: 'Include feasible revenue models',
        fairPlayTitle: '🛡️ Fair Evaluation Guidelines',
        fairPlay1: 'Duplicate or similar idea submissions are limited',
        fairPlay2: 'Daily AI analysis requests are limited',
        fairPlay3: 'System abuse may result in service restrictions'
      }
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Usage Tips */}
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

      {/* Quality Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-6 md:p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <Target className="h-6 w-6 mr-2 text-blue-600" />
          {text[currentLanguage].tips.qualityTitle}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.quality1}</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.quality2}</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.quality3}</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.quality4}</p>
          </div>
        </div>
      </div>

      {/* Fair Play Guidelines */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-lg p-6 md:p-8 border border-green-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-green-600" />
          {text[currentLanguage].tips.fairPlayTitle}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.fairPlay1}</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.fairPlay2}</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-700">{text[currentLanguage].tips.fairPlay3}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideTips;
