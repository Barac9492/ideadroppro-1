import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, Briefcase, Zap, Star, ArrowRight, Flame, Crown, MessageCircle } from 'lucide-react';

interface VCRadarSectionProps {
  currentLanguage: 'ko' | 'en';
}

const VCRadarSection: React.FC<VCRadarSectionProps> = ({ currentLanguage }) => {
  const [showConsultation, setShowConsultation] = useState<string | null>(null);

  const text = {
    ko: {
      title: '실제 VC가 선택한 이번 주 HOT 아이디어',
      subtitle: 'GPT + 실제 VC가 선별한 투자 가능성 높은 아이디어들',
      vcPick: 'VC PICK',
      hotDeal: '🔥 HOT DEAL',
      interested: '👀 관심 있음',
      gptAnalysis: 'GPT 분석',
      investmentPotential: '투자 가능성',
      mvpTimeline: 'MVP 타임라인',
      marketSize: '시장 규모',
      viewFull: '전체 분석 보기',
      requestConsult: '1:1 상담 신청',
      premiumFeature: '프리미엄 기능',
      consultationForm: '투자 상담 신청서',
      vcContact: 'VC 연락처 제공',
      sampleAnalysis: 'GPT는 이 아이디어가 B2B SaaS에서 6개월 내 MVP 가능성이 있다고 판단했습니다.',
      examples: [
        {
          idea: '배달 음식 포장 쓰레기를 줄이는 구독형 다회용 용기 서비스',
          vcComment: 'ESG 투자 트렌드와 부합하는 순환경제 모델',
          vcName: '그린벤처스 김OO 파트너',
          gptScore: 8.7,
          mvp: '3-4개월',
          market: '중형 (10억원)',
          status: 'hot',
          vcInterest: '높음'
        },
        {
          idea: 'AI 기반 개인 맞춤형 운동 PT 로봇',
          vcComment: '헬스케어 × AI 융합으로 글로벌 확장성 높음',
          vcName: '테크캐피탈 이OO 대표',
          gptScore: 9.2,
          mvp: '8-10개월',
          market: '대형 (100억원+)',
          status: 'interested',
          vcInterest: '매우 높음'
        },
        {
          idea: '반려동물 건강 상태 실시간 모니터링 웨어러블',
          vcComment: '펫테크 시장 급성장, B2C 타겟 명확',
          vcName: '스타트업얼라이언스 박OO 심사역',
          gptScore: 8.1,
          mvp: '6-8개월',
          market: '중형 (50억원)',
          status: 'interested',
          vcInterest: '높음'
        }
      ]
    },
    en: {
      title: 'This Week\'s HOT Ideas Selected by Real VCs',
      subtitle: 'High investment potential ideas selected by GPT + real VCs',
      vcPick: 'VC PICK',
      hotDeal: '🔥 HOT DEAL',
      interested: '👀 Interested',
      gptAnalysis: 'GPT Analysis',
      investmentPotential: 'Investment Potential',
      mvpTimeline: 'MVP Timeline',
      marketSize: 'Market Size',
      viewFull: 'View Full Analysis',
      requestConsult: 'Request 1:1 Consultation',
      premiumFeature: 'Premium Feature',
      consultationForm: 'Investment Consultation Form',
      vcContact: 'VC Contact Provided',
      sampleAnalysis: 'GPT determines this idea has MVP feasibility within 6 months in B2B SaaS.',
      examples: [
        {
          idea: 'Subscription-based reusable container service for delivery food waste reduction',
          vcComment: 'Circular economy model aligned with ESG investment trends',
          vcName: 'GreenVentures Partner Kim',
          gptScore: 8.7,
          mvp: '3-4 months',
          market: 'Medium ($10M)',
          status: 'hot',
          vcInterest: 'High'
        },
        {
          idea: 'AI-powered personalized workout PT robot',
          vcComment: 'Healthcare × AI convergence with high global scalability',
          vcName: 'TechCapital CEO Lee',
          gptScore: 9.2,
          mvp: '8-10 months',
          market: 'Large ($100M+)',
          status: 'interested',
          vcInterest: 'Very High'
        },
        {
          idea: 'Real-time pet health monitoring wearable',
          vcComment: 'Rapidly growing pet-tech market with clear B2C target',
          vcName: 'StartupAlliance Analyst Park',
          gptScore: 8.1,
          mvp: '6-8 months',
          market: 'Medium ($50M)',
          status: 'interested',
          vcInterest: 'High'
        }
      ]
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot':
        return (
          <Badge className="bg-red-500 text-white animate-pulse">
            <Flame className="w-3 h-3 mr-1" />
            {text[currentLanguage].hotDeal}
          </Badge>
        );
      case 'interested':
        return (
          <Badge className="bg-blue-500 text-white">
            {text[currentLanguage].interested}
          </Badge>
        );
      default:
        return null;
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
              className={`bg-white rounded-2xl p-8 shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                example.status === 'hot' 
                  ? 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50' 
                  : 'border-blue-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        example.status === 'hot' 
                          ? 'bg-gradient-to-br from-red-500 to-orange-600' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        {getStatusBadge(example.status)}
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      VC 관심도: {example.vcInterest}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {example.idea}
                  </h3>
                  
                  {/* VC Comment */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">
                        💼 {example.vcName}
                      </span>
                    </div>
                    <p className="text-blue-700 mb-3">
                      "{example.vcComment}"
                    </p>
                    
                    {/* Premium Consultation Button */}
                    <Button
                      onClick={() => setShowConsultation(showConsultation === example.idea ? null : example.idea)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {text[currentLanguage].requestConsult}
                    </Button>
                  </div>

                  {/* Consultation Form */}
                  {showConsultation === example.idea && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        🎯 {text[currentLanguage].consultationForm}
                      </h4>
                      <p className="text-sm text-purple-600 mb-3">
                        프리미엄 회원만 이용 가능한 기능입니다. VC 직접 연결 서비스를 제공합니다.
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          프리미엄 가입하기
                        </Button>
                        <Button size="sm" variant="outline">
                          더 알아보기
                        </Button>
                      </div>
                    </div>
                  )}
                  
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
                        <div className={`text-3xl font-bold ${
                          example.gptScore >= 9 ? 'text-green-600' : 
                          example.gptScore >= 8 ? 'text-blue-600' : 'text-purple-600'
                        }`}>
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
