
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Shield, Zap, AlertTriangle, Target } from 'lucide-react';

interface VCAnalysisData {
  fundingStage: string;
  revenueModel: string[];
  competitiveMoat: string[];
  scalability: string;
  riskFactors: string[];
  exitStrategy: string;
}

interface VCAnalysisSectionProps {
  analysis: VCAnalysisData;
  currentLanguage: 'ko' | 'en';
}

const VCAnalysisSection: React.FC<VCAnalysisSectionProps> = ({ analysis, currentLanguage }) => {
  const text = {
    ko: {
      title: 'VC 투자 분석',
      fundingStage: '펀딩 단계',
      revenueModel: '수익 모델',
      competitiveMoat: '경쟁 우위',
      scalability: '확장성',
      riskFactors: '리스크 요소',
      exitStrategy: 'Exit 전략'
    },
    en: {
      title: 'VC Investment Analysis',
      fundingStage: 'Funding Stage',
      revenueModel: 'Revenue Model',
      competitiveMoat: 'Competitive Moat',
      scalability: 'Scalability',
      riskFactors: 'Risk Factors',
      exitStrategy: 'Exit Strategy'
    }
  };

  const sections = [
    {
      key: 'fundingStage',
      title: text[currentLanguage].fundingStage,
      icon: TrendingUp,
      content: analysis.fundingStage,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'revenueModel',
      title: text[currentLanguage].revenueModel,
      icon: DollarSign,
      content: analysis.revenueModel,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      key: 'competitiveMoat',
      title: text[currentLanguage].competitiveMoat,
      icon: Shield,
      content: analysis.competitiveMoat,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50'
    },
    {
      key: 'scalability',
      title: text[currentLanguage].scalability,
      icon: Zap,
      content: analysis.scalability,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    {
      key: 'riskFactors',
      title: text[currentLanguage].riskFactors,
      icon: AlertTriangle,
      content: analysis.riskFactors,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50'
    },
    {
      key: 'exitStrategy',
      title: text[currentLanguage].exitStrategy,
      icon: Target,
      content: analysis.exitStrategy,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {text[currentLanguage].title}
        </h3>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          VC Perspective
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.key} className={`p-4 ${section.bgColor} rounded-lg border border-opacity-20`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`p-1.5 bg-gradient-to-r ${section.color} rounded-md text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  {section.title}
                </h4>
              </div>
              
              {Array.isArray(section.content) ? (
                <ul className="space-y-2">
                  {section.content.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VCAnalysisSection;
