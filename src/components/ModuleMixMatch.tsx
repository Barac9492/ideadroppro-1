
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Shuffle, Plus, ArrowRight } from 'lucide-react';
import { useModularIdeas, IdeaModule } from '@/hooks/useModularIdeas';
import ModuleCard from '@/components/ModuleCard';
import ModuleCombinator from '@/components/ModuleCombinator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleMixMatchProps {
  currentLanguage: 'ko' | 'en';
}

const ModuleMixMatch: React.FC<ModuleMixMatchProps> = ({ currentLanguage }) => {
  const { modules, loading, fetchModules } = useModularIdeas({ currentLanguage });
  const [selectedModules, setSelectedModules] = useState<IdeaModule[]>([]);
  const [showCombinator, setShowCombinator] = useState(false);
  const { user } = useAuth();

  const text = {
    ko: {
      title: '모듈 믹스앤매치',
      subtitle: '다양한 모듈들을 조합해서 새로운 아이디어를 만들어보세요',
      availableModules: '사용 가능한 모듈들',
      selectedModules: '선택된 모듈들',
      combineModules: '모듈 조합하기',
      clearSelection: '선택 초기화',
      noModules: '아직 사용 가능한 모듈이 없습니다',
      selectModules: '모듈을 선택하여 새로운 아이디어를 만들어보세요',
      moduleTypes: {
        problem: '문제점',
        solution: '솔루션',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        key_activities: '핵심 활동',
        key_resources: '핵심 자원',
        channels: '유통 채널',
        competitive_advantage: '경쟁 우위',
        market_size: '시장 규모',
        team: '팀',
        potential_risks: '잠재 리스크'
      }
    },
    en: {
      title: 'Module Mix & Match',
      subtitle: 'Combine different modules to create new ideas',
      availableModules: 'Available Modules',
      selectedModules: 'Selected Modules',
      combineModules: 'Combine Modules',
      clearSelection: 'Clear Selection',
      noModules: 'No modules available yet',
      selectModules: 'Select modules to create new ideas',
      moduleTypes: {
        problem: 'Problem',
        solution: 'Solution',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        key_activities: 'Key Activities',
        key_resources: 'Key Resources',
        channels: 'Channels',
        competitive_advantage: 'Competitive Advantage',
        market_size: 'Market Size',
        team: 'Team',
        potential_risks: 'Potential Risks'
      }
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleModuleSelect = (module: IdeaModule) => {
    const isSelected = selectedModules.find(m => m.id === module.id);
    if (isSelected) {
      setSelectedModules(prev => prev.filter(m => m.id !== module.id));
    } else {
      setSelectedModules(prev => [...prev, module]);
    }
  };

  const handleClearSelection = () => {
    setSelectedModules([]);
  };

  const handleStartCombination = () => {
    if (selectedModules.length >= 2) {
      setShowCombinator(true);
    } else {
      toast({
        title: currentLanguage === 'ko' ? '모듈을 더 선택해주세요' : 'Select more modules',
        description: currentLanguage === 'ko' ? '최소 2개 이상의 모듈이 필요합니다' : 'At least 2 modules are required',
        variant: 'destructive',
      });
    }
  };

  if (showCombinator) {
    return (
      <ModuleCombinator
        selectedModules={selectedModules}
        currentLanguage={currentLanguage}
        onBack={() => setShowCombinator(false)}
      />
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">모듈을 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{text[currentLanguage].title}</h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Selected modules section */}
      {selectedModules.length > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-purple-900">
                {text[currentLanguage].selectedModules} ({selectedModules.length})
              </CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleClearSelection}>
                  {text[currentLanguage].clearSelection}
                </Button>
                <Button onClick={handleStartCombination} className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {text[currentLanguage].combineModules}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {selectedModules.map((module) => (
                <div key={module.id} className="bg-white border border-purple-200 rounded-lg p-3">
                  <Badge variant="secondary" className="mb-2">
                    {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                  </Badge>
                  <p className="text-sm text-gray-700 line-clamp-2">{module.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Available modules section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shuffle className="w-5 h-5 text-blue-600" />
            <span>{text[currentLanguage].availableModules}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">{text[currentLanguage].noModules}</p>
              <p className="text-sm text-gray-500">{text[currentLanguage].selectModules}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isSelected={!!selectedModules.find(m => m.id === module.id)}
                  onSelect={() => handleModuleSelect(module)}
                  currentLanguage={currentLanguage}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleMixMatch;
