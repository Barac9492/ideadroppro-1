import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  Zap, 
  DollarSign, 
  Shield,
  Lightbulb,
  Cog,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { getModuleTitle, getModuleContent } from '@/utils/moduleUtils';

interface ModuleCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  modules: any[];
  count: number;
}

interface ModuleMenuGridProps {
  modules: any[];
  currentLanguage: 'ko' | 'en';
  onCategorySelect: (category: string) => void;
  onModuleSelect: (module: any) => void;
  selectedModules: any[];
}

const ModuleMenuGrid: React.FC<ModuleMenuGridProps> = ({
  modules,
  currentLanguage,
  onCategorySelect,
  onModuleSelect,
  selectedModules
}) => {
  const text = {
    ko: {
      title: '🎛️ 모듈 메뉴',
      subtitle: '원하는 카테고리를 선택하여 모듈을 조합해보세요',
      viewAll: '전체 보기',
      addToMix: '믹스에 추가',
      categories: {
        problem: {
          name: '문제 정의',
          description: '해결하고자 하는 핵심 문제들'
        },
        solution: {
          name: '솔루션',
          description: '혁신적인 해결 방법들'
        },
        target_customer: {
          name: '타겟 고객',
          description: '우리의 이상적인 고객들'
        },
        value_proposition: {
          name: '가치 제안',
          description: '고객에게 제공하는 핵심 가치'
        },
        revenue_model: {
          name: '수익 모델',
          description: '지속가능한 수익 창출 방법'
        },
        key_activities: {
          name: '핵심 활동',
          description: '비즈니스의 주요 활동들'
        },
        channels: {
          name: '유통 채널',
          description: '고객과 만나는 접점들'
        },
        competitive_advantage: {
          name: '경쟁 우위',
          description: '우리만의 차별화 요소'
        }
      }
    },
    en: {
      title: '🎛️ Module Menu',
      subtitle: 'Select categories to explore and combine modules',
      viewAll: 'View All',
      addToMix: 'Add to Mix',
      categories: {
        problem: {
          name: 'Problem Definition',
          description: 'Core problems to solve'
        },
        solution: {
          name: 'Solution',
          description: 'Innovative solutions'
        },
        target_customer: {
          name: 'Target Customer',
          description: 'Our ideal customers'
        },
        value_proposition: {
          name: 'Value Proposition',
          description: 'Core value for customers'
        },
        revenue_model: {
          name: 'Revenue Model',
          description: 'Sustainable revenue methods'
        },
        key_activities: {
          name: 'Key Activities',
          description: 'Main business activities'
        },
        channels: {
          name: 'Channels',
          description: 'Customer touchpoints'
        },
        competitive_advantage: {
          name: 'Competitive Advantage',
          description: 'Our unique differentiators'
        }
      }
    }
  };

  const moduleIcons = {
    problem: <Target className="w-8 h-8" />,
    solution: <Lightbulb className="w-8 h-8" />,
    target_customer: <Users className="w-8 h-8" />,
    value_proposition: <Zap className="w-8 h-8" />,
    revenue_model: <DollarSign className="w-8 h-8" />,
    key_activities: <Cog className="w-8 h-8" />,
    channels: <TrendingUp className="w-8 h-8" />,
    competitive_advantage: <Shield className="w-8 h-8" />
  };

  const moduleColors = {
    problem: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    solution: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    target_customer: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    value_proposition: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    revenue_model: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    key_activities: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    channels: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
    competitive_advantage: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
  };

  // Group modules by type - Fixed type checking
  const categorizedModules = modules.reduce((acc, module) => {
    const type = module.module_type || module.module_data?.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(module);
    return acc;
  }, {} as Record<string, any[]>);

  const categories: ModuleCategory[] = Object.keys(text[currentLanguage].categories).map(key => ({
    id: key,
    name: text[currentLanguage].categories[key as keyof typeof text[typeof currentLanguage]['categories']].name,
    description: text[currentLanguage].categories[key as keyof typeof text[typeof currentLanguage]['categories']].description,
    icon: moduleIcons[key as keyof typeof moduleIcons] || <Lightbulb className="w-8 h-8" />,
    color: moduleColors[key as keyof typeof moduleColors] || moduleColors.solution,
    modules: categorizedModules[key] || [],
    count: (categorizedModules[key] || []).length
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">{text[currentLanguage].title}</h2>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-gray-300"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardHeader className="text-center space-y-4">
              <div className={`mx-auto p-4 rounded-full bg-gradient-to-br ${category.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-gray-700">
                  {category.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {category.count} 모듈
                </Badge>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              
              {/* Preview of modules in this category */}
              {category.modules.length > 0 && (
                <div className="space-y-2">
                  {category.modules.slice(0, 2).map((module) => {
                    const title = getModuleTitle(module);
                    const content = getModuleContent(module);
                    return (
                      <div 
                        key={module.id}
                        className="bg-gray-50 rounded p-2 text-xs text-gray-700 line-clamp-2 hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onModuleSelect(module);
                        }}
                      >
                        <div className="font-medium mb-1 truncate">{title}</div>
                        <div className="text-gray-600 line-clamp-1">{content}</div>
                      </div>
                    );
                  })}
                  {category.modules.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{category.modules.length - 2} more...
                    </div>
                  )}
                </div>
              )}
              
              {category.modules.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-4">
                  아직 이 카테고리의 모듈이 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedModules.length > 0 ? `${selectedModules.length}개 모듈 선택됨` : '모듈을 선택해주세요'}
            </h3>
            <p className="text-sm text-gray-600">
              다양한 카테고리에서 모듈을 선택하여 새로운 아이디어를 만들어보세요
            </p>
          </div>
          <Button 
            variant="outline" 
            disabled={selectedModules.length === 0}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            조합 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModuleMenuGrid;
