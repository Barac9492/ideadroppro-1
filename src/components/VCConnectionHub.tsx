
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle,
  Clock,
  Eye,
  Star,
  Zap,
  Crown
} from 'lucide-react';

interface VCOpportunity {
  id: string;
  ideaTitle: string;
  ideaContent: string;
  vcPotential: number;
  status: 'selected' | 'reviewing' | 'interested' | 'contacted';
  vcFirm?: string;
  estimatedValue?: string;
  timeline?: string;
  requirements: string[];
  author: string;
}

interface VCConnectionHubProps {
  currentLanguage: 'ko' | 'en';
  userId?: string;
}

const VCConnectionHub: React.FC<VCConnectionHubProps> = ({
  currentLanguage,
  userId
}) => {
  const [opportunities, setOpportunities] = useState<VCOpportunity[]>([]);
  const [stats, setStats] = useState({
    totalSelected: 0,
    activeReviews: 0,
    successfulConnections: 0,
    averageValue: '0'
  });

  const text = {
    ko: {
      title: 'VC 연결 허브',
      subtitle: '당신의 아이디어가 실제 투자로 이어지는 곳',
      myOpportunities: '내 투자 기회',
      vcPipeline: 'VC 파이프라인',
      status: {
        selected: 'VC 선정됨',
        reviewing: '검토 중',
        interested: '관심 표명',
        contacted: '연락 받음'
      },
      stats: {
        totalSelected: '총 선정된 아이디어',
        activeReviews: '활성 검토',
        successfulConnections: '성공적 연결',
        averageValue: '평균 예상 가치'
      },
      vcPotential: 'VC 관심도',
      estimatedValue: '예상 투자 가치',
      timeline: '예상 소요 시간',
      requirements: '요구사항',
      viewDetails: '자세히 보기',
      contactVC: 'VC 연락하기',
      preparing: '준비 중...',
      nextSteps: '다음 단계',
      tips: 'VC 연결 팁',
      tipsList: [
        '아이디어 완성도를 높이세요 (8점 이상)',
        '커뮤니티 반응을 긍정적으로 만드세요',
        '실현 가능성을 구체적으로 설명하세요',
        '시장 크기와 타겟을 명확히 하세요'
      ]
    },
    en: {
      title: 'VC Connection Hub',
      subtitle: 'Where your ideas become real investments',
      myOpportunities: 'My Investment Opportunities',
      vcPipeline: 'VC Pipeline',
      status: {
        selected: 'VC Selected',
        reviewing: 'Under Review',
        interested: 'VC Interested',
        contacted: 'Contacted'
      },
      stats: {
        totalSelected: 'Total Selected Ideas',
        activeReviews: 'Active Reviews',
        successfulConnections: 'Successful Connections',
        averageValue: 'Average Estimated Value'
      },
      vcPotential: 'VC Interest Level',
      estimatedValue: 'Estimated Investment Value',
      timeline: 'Expected Timeline',
      requirements: 'Requirements',
      viewDetails: 'View Details',
      contactVC: 'Contact VC',
      preparing: 'Preparing...',
      nextSteps: 'Next Steps',
      tips: 'VC Connection Tips',
      tipsList: [
        'Improve idea completeness (8+ score)',
        'Build positive community response',
        'Explain feasibility in detail', 
        'Clarify market size and target'
      ]
    }
  };

  useEffect(() => {
    // VC 연결 기회 데이터 시뮬레이션
    const mockOpportunities: VCOpportunity[] = [
      {
        id: '1',
        ideaTitle: currentLanguage === 'ko' ? 'AI 반려동물 건강 모니터링' : 'AI Pet Health Monitoring',
        ideaContent: currentLanguage === 'ko' ? 
          'AI로 반려동물의 행동과 생체 신호를 분석해 질병을 조기 발견하는 웨어러블 디바이스' :
          'Wearable device that analyzes pet behavior and biosignals with AI for early disease detection',
        vcPotential: 87,
        status: 'interested',
        vcFirm: 'TechVenture Partners',
        estimatedValue: '$2.5M',
        timeline: '3-4 weeks',
        requirements: currentLanguage === 'ko' ? [
          '프로토타입 개발 계획',
          '수의사 파트너십',
          '규제 준수 방안'
        ] : [
          'Prototype development plan',
          'Veterinary partnerships',
          'Regulatory compliance'
        ],
        author: 'PetTech Innovator'
      },
      {
        id: '2',
        ideaTitle: currentLanguage === 'ko' ? '도시 농업 자동화 시스템' : 'Urban Farming Automation',
        ideaContent: currentLanguage === 'ko' ? 
          '도심 속 수직 농장을 AI로 완전 자동화하는 통합 솔루션' :
          'Integrated solution for fully AI-automated vertical farms in urban areas',
        vcPotential: 92,
        status: 'reviewing',
        vcFirm: 'GreenTech Capital',
        estimatedValue: '$5.0M',
        timeline: '2-3 weeks',
        requirements: currentLanguage === 'ko' ? [
          '기술 특허 출원',
          '파일럿 농장 운영',
          '수익성 검증'
        ] : [
          'Technology patent filing',
          'Pilot farm operation',
          'Profitability validation'
        ],
        author: 'Urban Farmer'
      }
    ];

    setOpportunities(mockOpportunities);
    setStats({
      totalSelected: 12,
      activeReviews: 5,
      successfulConnections: 3,
      averageValue: '$1.8M'
    });
  }, [currentLanguage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'interested': return 'bg-green-100 text-green-700 border-green-200';
      case 'contacted': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected': return <Target className="w-4 h-4" />;
      case 'reviewing': return <Clock className="w-4 h-4" />;
      case 'interested': return <Eye className="w-4 h-4" />;
      case 'contacted': return <CheckCircle className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8 text-yellow-300" />
            <div>
              <h1 className="text-3xl font-bold">{text[currentLanguage].title}</h1>
              <p className="text-green-100 mt-1">{text[currentLanguage].subtitle}</p>
            </div>
          </div>
          
          {/* 실시간 VC 활동 지표 */}
          <div className="bg-white/20 rounded-xl p-4 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
              <span className="font-semibold">
                {currentLanguage === 'ko' ? '15명의 VC가 활성 상태' : '15 VCs are active'}
              </span>
            </div>
            <div className="text-green-100">
              {currentLanguage === 'ko' ? '🔥 이번 주 3건의 새로운 연결' : '🔥 3 new connections this week'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 현황 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{value}</div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].stats[key as keyof typeof text[typeof currentLanguage]['stats']]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* VC 연결 팁 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>{text[currentLanguage].tips}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {text[currentLanguage].tipsList.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-yellow-800">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 투자 기회 목록 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <span>{text[currentLanguage].myOpportunities}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="border rounded-xl p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {opportunity.ideaTitle}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {opportunity.ideaContent}
                      </p>
                    </div>
                    <Badge className={`ml-4 ${getStatusColor(opportunity.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(opportunity.status)}
                        <span>{text[currentLanguage].status[opportunity.status]}</span>
                      </div>
                    </Badge>
                  </div>

                  {/* VC 관심도 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {text[currentLanguage].vcPotential}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {opportunity.vcPotential}%
                      </span>
                    </div>
                    <Progress value={opportunity.vcPotential} className="h-2" />
                  </div>

                  {/* 상세 정보 */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          <strong>VC:</strong> {opportunity.vcFirm}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          <strong>{text[currentLanguage].estimatedValue}:</strong> {opportunity.estimatedValue}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          <strong>{text[currentLanguage].timeline}:</strong> {opportunity.timeline}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        {text[currentLanguage].requirements}:
                      </h4>
                      <ul className="space-y-1">
                        {opportunity.requirements.map((req, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {text[currentLanguage].viewDetails}
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="sm"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      {text[currentLanguage].contactVC}
                    </Button>
                  </div>
                </div>
              ))}

              {/* 새로운 기회를 위한 CTA */}
              <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-dashed border-purple-200">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentLanguage === 'ko' ? '더 많은 VC 기회를 원하시나요?' : 'Want more VC opportunities?'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {currentLanguage === 'ko' ? 
                    '아이디어 점수를 높이고 커뮤니티 반응을 늘려보세요!' :
                    'Improve your idea scores and increase community engagement!'
                  }
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {currentLanguage === 'ko' ? '아이디어 개선하기' : 'Improve Ideas'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VCConnectionHub;
