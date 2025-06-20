
import React from 'react';
import { BarChart3, Globe, TrendingUp, Heart } from 'lucide-react';

interface GuideFeaturesProps {
  currentLanguage: 'ko' | 'en';
}

const GuideFeatures: React.FC<GuideFeaturesProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      features: {
        title: '주요 기능',
        aiAnalysis: {
          title: 'VC 기반 AI 1차 평가',
          desc: '현직 벤처캐피털리스트들의 평가 기준을 학습한 AI가 실시간으로 아이디어를 분석합니다.'
        },
        globalAnalysis: {
          title: '글로벌 시장 분석',
          desc: '전 세계 시장 동향과 비교하여 아이디어의 글로벌 경쟁력을 평가합니다.'
        },
        vcAdvice: {
          title: 'VC 전문가 조언',
          desc: 'AI 고득점 아이디어에 대해 실제 VC들이 투자 관점의 추가적인 조언과 피드백을 제공합니다.'
        },
        community: {
          title: '커뮤니티',
          desc: '다른 사용자들의 아이디어를 보고 좋아요로 응원할 수 있습니다.'
        }
      }
    },
    en: {
      features: {
        title: 'Key Features',
        aiAnalysis: {
          title: 'VC-Based AI Initial Evaluation',
          desc: 'AI trained on real venture capitalist evaluation criteria analyzes your ideas in real-time.'
        },
        globalAnalysis: {
          title: 'Global Market Analysis',
          desc: 'Evaluate your idea\'s global competitiveness against worldwide market trends.'
        },
        vcAdvice: {
          title: 'VC Expert Advice',
          desc: 'High-scoring ideas receive additional investment-focused advice and feedback from real VCs.'
        },
        community: {
          title: 'Community',
          desc: 'View other users\' ideas and show support with likes.'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {text[currentLanguage].features.title}
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.aiAnalysis.title}</h3>
          <p className="text-slate-600 text-sm">{text[currentLanguage].features.aiAnalysis.desc}</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.globalAnalysis.title}</h3>
          <p className="text-slate-600 text-sm">{text[currentLanguage].features.globalAnalysis.desc}</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.vcAdvice.title}</h3>
          <p className="text-slate-600 text-sm">{text[currentLanguage].features.vcAdvice.desc}</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.community.title}</h3>
          <p className="text-slate-600 text-sm">{text[currentLanguage].features.community.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default GuideFeatures;
