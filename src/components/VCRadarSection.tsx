
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Briefcase, Zap, Star, ArrowRight } from 'lucide-react';

interface VCRadarSectionProps {
  currentLanguage: 'ko' | 'en';
}

const VCRadarSection: React.FC<VCRadarSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '이번 주 \'VC가 보고 있는 아이디어\'',
      subtitle: 'GPT + 실제 VC가 선별한 투자 가능성 높은 아이디어들',
      vcPick: 'VC PICK',
      gptAnalysis: 'GPT 분석',
      investmentPotential: '투자 가능성',
      mvpTimeline: 'MVP 타임라인',
      marketSize: '시장 규모',
      viewFull: '전체 분석 보기',
      sampleAnalysis: 'GPT는 이 아이디어가 B2B SaaS에서 6개월 내 MVP 가능성이 있다고 판단했습니다.',
      examples: [
        {
          idea: '배달 음식 포장 쓰레기를 줄이는 구독형 다회용 용기 서비스',
          vcComment: 'ESG 투자 트렌드와 부합하는 순환경제 모델',
          gptScore: 8.7,
          mvp: '3-4개월',
          market: '중형 (10억원)'
        },
        {
          idea: 'AI 기반 개인 맞춤형 운동 PT 로봇',
          vcComment: '헬스케어 × AI 융합으로 글로벌 확장성 높음',
          gptScore: 9.2,
          mvp: '8-10개월',
          market: '대형 (100억원+)'
        },
        {
          idea: '반려동물 건강 상태 실시간 모니터링 웨어러블',
          vcComment: '펫테크 시장 급성장, B2C 타겟 명확',
          gptScore: 8.1,
          mvp: '6-8개월',
          market: '중형 (50억원)'
        }
      ]
    },
    en: {
      title: 'This Week\'s \'VC-Watched Ideas\'',
      subtitle: 'High investment potential ideas selected by GPT + real VCs',
      vcPick: 'VC PICK',
      gptAnalysis: 'GPT Analysis',
      investmentPotential: 'Investment Potential',
      mvpTimeline: 'MVP Timeline',
      marketSize: 'Market Size',
      viewFull: 'View Full Analysis',
      sampleAnalysis: 'GPT determines this idea has MVP feasibility within 6 months in B2B SaaS.',
      examples: [
        {
          idea: 'Subscription-based reusable container service for delivery food waste reduction',
          vcComment: 'Circular economy model aligned with ESG investment trends',
          gptScore: 8.7,
          mvp: '3-4 months',
          market: 'Medium ($10M)'
        },
        {
          idea: 'AI-powered personalized workout PT robot',
          vcComment: 'Healthcare × AI convergence with high global scalability',
          gptScore: 9.2,
          mvp: '8-10 months',
          market: 'Large ($100M+)'
        },
        {
          idea: 'Real-time pet health monitoring wearable',
          vcComment: 'Rapidly growing pet-tech market with clear B2C target',
          gptScore: 8.1,
          mvp: '6-8 months',
          market: 'Medium ($50M)'
        }
      ]
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <Badge className="bg-blue-600 text-white px-3 py-1">
              {text[currentLanguage].vcPick}
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            💼 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* VC Picks Grid */}
        <div className="space-y-6 mb-12">
          {text[currentLanguage].examples.map((example, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {example.idea}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {example.vcComment}
                      </p>
                      
                      {/* GPT Analysis Box */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-800">
                            🔍 {text[currentLanguage].gptAnalysis}
                          </span>
                        </div>
                        <p className="text-sm text-purple-700">
                          {text[currentLanguage].sampleAnalysis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 h-full">
                    <div className="space-y-6">
                      {/* GPT Score */}
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-600">GPT Score</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-600">
                          {example.gptScore}/10
                        </div>
                      </div>

                      {/* MVP Timeline */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">
                            {text[currentLanguage].mvpTimeline}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {example.mvp}
                        </div>
                      </div>

                      {/* Market Size */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">
                            {text[currentLanguage].marketSize}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {example.market}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        {text[currentLanguage].viewFull}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VCRadarSection;
