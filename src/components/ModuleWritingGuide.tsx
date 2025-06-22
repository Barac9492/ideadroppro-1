
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Target,
  Users,
  DollarSign,
  Settings,
  Package,
  Megaphone,
  Shield,
  TrendingUp,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface ModuleWritingGuideProps {
  currentLanguage: 'ko' | 'en';
  selectedModuleType?: string;
}

const ModuleWritingGuide: React.FC<ModuleWritingGuideProps> = ({
  currentLanguage,
  selectedModuleType
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = {
    ko: {
      title: '📝 모듈 작성 가이드',
      toggleButton: isExpanded ? '가이드 닫기' : '가이드 보기',
      modules: {
        problem: {
          title: '문제점',
          icon: AlertTriangle,
          description: '해결하려는 구체적인 문제를 명확히 정의하세요',
          good: [
            '20-30대 직장인들이 점심시간에 건강한 식사를 찾기 어려움',
            '기존 배달앱은 주로 기름진 음식 위주로 구성되어 있음',
            '건강식 정보를 얻기 위해 여러 앱을 확인해야 하는 번거로움'
          ],
          bad: [
            '사람들이 불편함을 느낀다',
            '현재 시장에 좋은 제품이 없다',
            '문제가 있는 것 같다'
          ],
          tips: [
            '구체적인 대상을 명시하세요',
            '측정 가능한 문제를 제시하세요',
            '실제 경험을 바탕으로 작성하세요'
          ]
        },
        solution: {
          title: '솔루션',
          icon: Lightbulb,
          description: '문제를 해결하는 구체적이고 혁신적인 방법을 제시하세요',
          good: [
            'AI 기반 개인 맞춤형 건강식 추천 및 배달 플랫폼',
            '사용자 건강 데이터 분석으로 최적 메뉴 큐레이션',
            '5분 내 주문 완료 가능한 간편 인터페이스'
          ],
          bad: [
            '좋은 앱을 만들겠다',
            '기존보다 나은 서비스 제공',
            '사용자가 만족할 솔루션'
          ],
          tips: [
            '어떻게 문제를 해결할지 구체적으로 설명하세요',
            '기술적 차별점을 포함하세요',
            '사용자 경험을 중심으로 기술하세요'
          ]
        },
        target_customer: {
          title: '타겟 고객',
          icon: Users,
          description: '구체적인 고객층을 정의하고 그들의 특징을 명시하세요',
          good: [
            '25-35세 서울 강남권 직장인 (연봉 4000만원 이상)',
            '건강 관심도 높은 1인 가구 여성',
            '점심시간 30분 내 식사 해결 필요한 직장인'
          ],
          bad: [
            '모든 사람들',
            '앱을 사용하는 사람들',
            '20-60대 남녀'
          ],
          tips: [
            '연령, 지역, 소득수준을 구체적으로 명시하세요',
            '행동 패턴과 니즈를 포함하세요',
            '너무 광범위하지 않게 타겟을 좁히세요'
          ]
        },
        value_proposition: {
          title: '가치 제안',
          icon: Target,
          description: '고객이 얻는 구체적인 가치와 혜택을 명시하세요',
          good: [
            '매일 점심시간 10분 단축으로 업무 효율성 20% 향상',
            '개인 맞춤 영양 관리로 월 의료비 30% 절약',
            '건강한 식습관으로 업무 집중력 15% 개선'
          ],
          bad: [
            '편리한 서비스 제공',
            '고객 만족도 향상',
            '좋은 경험 제공'
          ],
          tips: [
            '정량적 혜택을 포함하세요',
            '경쟁사 대비 차별점을 명확히 하세요',
            '고객의 실제 pain point 해결방안을 제시하세요'
          ]
        }
      },
      categories: {
        core: '핵심 모듈',
        business: '비즈니스 모듈',
        execution: '실행 모듈'
      }
    },
    en: {
      title: '📝 Module Writing Guide',
      toggleButton: isExpanded ? 'Close Guide' : 'Show Guide',
      modules: {
        problem: {
          title: 'Problem',
          icon: AlertTriangle,
          description: 'Clearly define the specific problem you are trying to solve',
          good: [
            'Office workers in their 20s-30s struggle to find healthy meals during lunch break',
            'Existing delivery apps mainly focus on greasy fast food options',
            'Users need to check multiple apps to find healthy food information'
          ],
          bad: [
            'People feel inconvenience',
            'There are no good products in the market',
            'There seems to be a problem'
          ],
          tips: [
            'Specify the target audience clearly',
            'Present measurable problems',
            'Base on real experiences'
          ]
        },
        solution: {
          title: 'Solution',
          icon: Lightbulb,
          description: 'Present specific and innovative methods to solve the problem',
          good: [
            'AI-powered personalized healthy food recommendation and delivery platform',
            'Optimal menu curation through user health data analysis',
            'Simple interface allowing order completion within 5 minutes'
          ],
          bad: [
            'Will create a good app',
            'Provide better service than existing ones',
            'Solution that users will be satisfied with'
          ],
          tips: [
            'Specifically explain how you will solve the problem',
            'Include technical differentiators',
            'Focus on user experience'
          ]
        },
        target_customer: {
          title: 'Target Customer',
          icon: Users,
          description: 'Define specific customer segments and specify their characteristics',
          good: [
            'Office workers aged 25-35 in Gangnam, Seoul (annual income 40M+ KRW)',
            'Health-conscious single-person households, female',
            'Office workers who need to finish lunch within 30 minutes'
          ],
          bad: [
            'Everyone',
            'People who use apps',
            'Men and women aged 20-60'
          ],
          tips: [
            'Specifically mention age, location, income level',
            'Include behavior patterns and needs',
            'Narrow down the target, not too broad'
          ]
        },
        value_proposition: {
          title: 'Value Proposition',
          icon: Target,
          description: 'Specify the concrete value and benefits customers will receive',
          good: [
            '20% improvement in work efficiency by saving 10 minutes at lunch daily',
            '30% reduction in monthly medical costs through personalized nutrition management',
            '15% improvement in work concentration through healthy eating habits'
          ],
          bad: [
            'Provide convenient service',
            'Improve customer satisfaction',
            'Provide good experience'
          ],
          tips: [
            'Include quantitative benefits',
            'Clearly state differentiators compared to competitors',
            'Present solutions to customers\' actual pain points'
          ]
        }
      },
      categories: {
        core: 'Core Modules',
        business: 'Business Modules',
        execution: 'Execution Modules'
      }
    }
  };

  const moduleCategories = {
    core: ['problem', 'solution', 'target_customer', 'value_proposition'],
    business: ['revenue_model', 'market_size', 'competitive_advantage'],
    execution: ['key_activities', 'key_resources', 'channels', 'team', 'potential_risks']
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {text[currentLanguage].toggleButton}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <Tabs defaultValue={selectedModuleType || 'problem'} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="core">{text[currentLanguage].categories.core}</TabsTrigger>
              <TabsTrigger value="business">{text[currentLanguage].categories.business}</TabsTrigger>
              <TabsTrigger value="execution">{text[currentLanguage].categories.execution}</TabsTrigger>
            </TabsList>

            {Object.entries(moduleCategories).map(([category, modules]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {modules.map((moduleType) => {
                  const moduleData = text[currentLanguage].modules[moduleType as keyof typeof text[typeof currentLanguage]['modules']];
                  if (!moduleData) return null;

                  return (
                    <Card key={moduleType} className="border-l-4 border-l-blue-400">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <moduleData.icon className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">{moduleData.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{moduleData.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Good Examples */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-700">Good Examples</span>
                          </div>
                          <div className="space-y-2">
                            {moduleData.good.map((example, index) => (
                              <Badge key={index} variant="secondary" className="block w-full text-left p-2 bg-green-50 text-green-800 border-green-200">
                                ✅ {example}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Bad Examples */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="font-medium text-red-700">Avoid These</span>
                          </div>
                          <div className="space-y-2">
                            {moduleData.bad.map((example, index) => (
                              <Badge key={index} variant="secondary" className="block w-full text-left p-2 bg-red-50 text-red-800 border-red-200">
                                ❌ {example}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Tips */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span className="font-medium text-amber-700">Writing Tips</span>
                          </div>
                          <div className="space-y-1">
                            {moduleData.tips.map((tip, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default ModuleWritingGuide;
