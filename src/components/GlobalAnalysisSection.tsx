
import React from 'react';
import { Globe, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';

interface GlobalAnalysisData {
  marketAcceptance?: {
    [key: string]: {
      score: number;
      reasons: string[];
      challenges: string[];
    };
  };
  culturalFit?: {
    adaptationNeeded: string[];
    culturalBarriers: string[];
    opportunities: string[];
  };
  competitiveAnalysis?: {
    globalCompetitors: string[];
    entryBarriers: string[];
    advantages: string[];
  };
  recommendedMarkets?: Array<{
    market: string;
    priority: number;
    reasons: string[];
  }>;
  localizationStrategy?: {
    technical: string[];
    business: string[];
    marketing: string[];
  };
  summary?: string;
}

interface GlobalAnalysisSectionProps {
  globalAnalysis: GlobalAnalysisData;
  currentLanguage: 'ko' | 'en';
}

const GlobalAnalysisSection: React.FC<GlobalAnalysisSectionProps> = ({
  globalAnalysis,
  currentLanguage
}) => {
  const text = {
    ko: {
      globalAnalysis: '🌍 글로벌 시장 분석',
      marketAcceptance: '지역별 시장 수용성',
      culturalFit: '문화적 적합성',
      competition: '글로벌 경쟁 분석',
      recommendedMarkets: '우선 진출 시장',
      localization: '현지화 전략',
      summary: '종합 평가',
      score: '점수',
      reasons: '긍정 요소',
      challenges: '도전 과제',
      adaptationNeeded: '현지화 필요사항',
      culturalBarriers: '문화적 장벽',
      opportunities: '기회 요소',
      competitors: '주요 경쟁사',
      entryBarriers: '진입 장벽',
      advantages: '경쟁 우위',
      priority: '우선순위',
      technical: '기술적 요소',
      business: '비즈니스 전략',
      marketing: '마케팅 전략'
    },
    en: {
      globalAnalysis: '🌍 Global Market Analysis',
      marketAcceptance: 'Regional Market Acceptance',
      culturalFit: 'Cultural Fit',
      competition: 'Global Competition Analysis',
      recommendedMarkets: 'Recommended Priority Markets',
      localization: 'Localization Strategy',
      summary: 'Summary',
      score: 'Score',
      reasons: 'Positive Factors',
      challenges: 'Challenges',
      adaptationNeeded: 'Adaptation Needed',
      culturalBarriers: 'Cultural Barriers',
      opportunities: 'Opportunities',
      competitors: 'Key Competitors',
      entryBarriers: 'Entry Barriers',
      advantages: 'Competitive Advantages',
      priority: 'Priority',
      technical: 'Technical',
      business: 'Business Strategy',
      marketing: 'Marketing Strategy'
    }
  };

  const getRegionFlag = (region: string) => {
    const regionMap: { [key: string]: string } = {
      'northAmerica': '🇺🇸',
      'europe': '🇪🇺',
      'asia': '🌏',
      'china': '🇨🇳',
      'japan': '🇯🇵',
      'southeastAsia': '🌴'
    };
    return regionMap[region] || '🌍';
  };

  const getRegionName = (region: string) => {
    const regionNames = {
      ko: {
        'northAmerica': '북미',
        'europe': '유럽',
        'asia': '아시아',
        'china': '중국',
        'japan': '일본',
        'southeastAsia': '동남아시아'
      },
      en: {
        'northAmerica': 'North America',
        'europe': 'Europe',
        'asia': 'Asia',
        'china': 'China',
        'japan': 'Japan',
        'southeastAsia': 'Southeast Asia'
      }
    };
    return regionNames[currentLanguage][region as keyof typeof regionNames.ko] || region;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-blue-600 bg-blue-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 rounded-3xl p-6 mb-4 border-2 border-emerald-200 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="h-6 w-6 text-emerald-600" />
        <h3 className="text-xl font-bold text-slate-800">{text[currentLanguage].globalAnalysis}</h3>
      </div>

      {/* Market Acceptance */}
      {globalAnalysis.marketAcceptance && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
            {text[currentLanguage].marketAcceptance}
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(globalAnalysis.marketAcceptance).map(([region, data]) => (
              <div key={region} className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getRegionFlag(region)}</span>
                    <span className="font-medium text-slate-800">{getRegionName(region)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(data.score)}`}>
                    {data.score}/10
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1">{text[currentLanguage].reasons}</p>
                    <ul className="text-xs text-slate-600">
                      {data.reasons?.map((reason, idx) => (
                        <li key={idx}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1">{text[currentLanguage].challenges}</p>
                    <ul className="text-xs text-slate-600">
                      {data.challenges?.map((challenge, idx) => (
                        <li key={idx}>• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Markets */}
      {globalAnalysis.recommendedMarkets && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            {text[currentLanguage].recommendedMarkets}
          </h4>
          <div className="space-y-3">
            {globalAnalysis.recommendedMarkets.map((market, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    #{market.priority}
                  </span>
                  <span className="font-medium text-slate-800">{market.market}</span>
                </div>
                <ul className="text-sm text-slate-600">
                  {market.reasons?.map((reason, reasonIdx) => (
                    <li key={reasonIdx}>• {reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cultural Fit */}
      {globalAnalysis.culturalFit && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            {text[currentLanguage].culturalFit}
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
              <p className="font-medium text-purple-700 mb-2">{text[currentLanguage].adaptationNeeded}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {globalAnalysis.culturalFit.adaptationNeeded?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
              <p className="font-medium text-red-700 mb-2">{text[currentLanguage].culturalBarriers}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {globalAnalysis.culturalFit.culturalBarriers?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <p className="font-medium text-green-700 mb-2">{text[currentLanguage].opportunities}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {globalAnalysis.culturalFit.opportunities?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Localization Strategy */}
      {globalAnalysis.localizationStrategy && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            {text[currentLanguage].localization}
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
              <p className="font-medium text-yellow-700 mb-2">{text[currentLanguage].technical}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {globalAnalysis.localizationStrategy.technical?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
              <p className="font-medium text-indigo-700 mb-2">{text[currentLanguage].business}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {globalAnalysis.localizationStrategy.business?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-100">
              <p className="font-medium text-pink-700 mb-2">{text[currentLanguage].marketing}</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {globalAnalysis.localizationStrategy.marketing?.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {globalAnalysis.summary && (
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 border border-emerald-200">
          <h4 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].summary}</h4>
          <p className="text-slate-700">{globalAnalysis.summary}</p>
        </div>
      )}
    </div>
  );
};

export default GlobalAnalysisSection;
