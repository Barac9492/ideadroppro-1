
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Zap, TrendingUp, TrendingDown, Edit3, Plus } from 'lucide-react';
import { getModuleTitle, getModuleContent, getModuleScore, getModuleType } from '@/utils/moduleUtils';
import ModuleEditModal from './ModuleEditModal';

interface ModuleImprovementProps {
  moduleType: string;
  currentModule?: any;
  alternativeModules: any[];
  currentLanguage: 'ko' | 'en';
  onBack: () => void;
  onSelectModule: (module: any) => void;
  onGenerateNew: () => void;
}

const ModuleImprovement: React.FC<ModuleImprovementProps> = ({
  moduleType,
  currentModule,
  alternativeModules,
  currentLanguage,
  onBack,
  onSelectModule,
  onGenerateNew
}) => {
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);
  const [scorePreview, setScorePreview] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);

  const text = {
    ko: {
      title: '모듈 개선하기',
      current: '현재',
      alternatives: '대안들',
      preview: '예상 점수 변화',
      apply: '적용하기',
      generateNew: '새 아이디어 생성',
      backToOverview: '전체보기로 돌아가기',
      noAlternatives: '사용 가능한 대안이 없습니다',
      scoreIncrease: '점수 향상 예상',
      scoreDecrease: '점수 하락 예상',
      editDirect: '직접 편집',
      createNew: '새로 작성',
      chooseFromOptions: '기존 옵션에서 선택',
      moduleTypes: {
        problem: '문제 정의',
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
      title: 'Improve Module',
      current: 'Current',
      alternatives: 'Alternatives',
      preview: 'Expected Score Change',
      apply: 'Apply',
      generateNew: 'Generate New Idea',
      backToOverview: 'Back to Overview',
      noAlternatives: 'No alternatives available',
      scoreIncrease: 'Score increase expected',
      scoreDecrease: 'Score decrease expected',
      editDirect: 'Edit Directly',
      createNew: 'Create New',
      chooseFromOptions: 'Choose from Options',
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

  // Simulate score preview when alternative is selected
  useEffect(() => {
    if (selectedAlternative && currentModule) {
      const currentScore = getModuleScore(currentModule);
      const newScore = getModuleScore(selectedAlternative);
      setScorePreview(newScore - currentScore);
      console.log('Score comparison:', { currentScore, newScore, difference: newScore - currentScore });
    } else {
      setScorePreview(null);
    }
  }, [selectedAlternative, currentModule]);

  const handleEditCurrent = () => {
    setEditingModule(currentModule);
    setIsEditModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingModule(null);
    setIsEditModalOpen(true);
  };

  const handleSaveModule = (newModule: any) => {
    onSelectModule(newModule);
    setIsEditModalOpen(false);
  };

  const renderModuleCard = (module: any, isSelected: boolean, isCurrent: boolean = false) => {
    const title = getModuleTitle(module);
    const content = getModuleContent(module);
    const score = getModuleScore(module);

    console.log('Rendering module card:', { moduleId: module.id, title, score, isCurrent, isSelected });

    return (
      <Card 
        className={`transition-all duration-300 cursor-pointer ${
          isSelected 
            ? 'ring-2 ring-purple-500 bg-purple-50 shadow-lg' 
            : isCurrent
            ? 'border-blue-300 bg-blue-50 shadow-md'
            : 'hover:shadow-md hover:bg-gray-50'
        }`}
        onClick={() => !isCurrent && setSelectedAlternative(module)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant={isCurrent ? "secondary" : isSelected ? "default" : "outline"}
              className={isCurrent ? "bg-blue-600 text-white" : isSelected ? "bg-purple-600" : ""}
            >
              {isCurrent ? text[currentLanguage].current : `${score}점`}
            </Badge>
            {!isCurrent && currentModule && (
              <div className="flex items-center space-x-1">
                {score > getModuleScore(currentModule) ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : score < getModuleScore(currentModule) ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : null}
                <span className={`text-xs font-medium ${
                  score > getModuleScore(currentModule) ? 'text-green-600' : 
                  score < getModuleScore(currentModule) ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {score > getModuleScore(currentModule) ? '+' : ''}
                  {score - getModuleScore(currentModule)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
              {title}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {content}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {text[currentLanguage].backToOverview}
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {text[currentLanguage].moduleTypes[moduleType as keyof typeof text[typeof currentLanguage]['moduleTypes']]} {text[currentLanguage].title}
          </h2>
        </div>
        <div />
      </div>

      {/* Direct Edit Options */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">직접 편집 옵션</h3>
        <div className="flex flex-wrap gap-3">
          {currentModule && (
            <Button 
              onClick={handleEditCurrent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {text[currentLanguage].editDirect}
            </Button>
          )}
          <Button 
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {text[currentLanguage].createNew}
          </Button>
          <div className="flex-1 flex items-center">
            <span className="text-sm text-gray-600 ml-4">
              또는 아래에서 {text[currentLanguage].chooseFromOptions}
            </span>
          </div>
        </div>
      </div>

      {/* Current vs Alternative Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Module */}
        {currentModule && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Badge variant="secondary" className="mr-2 bg-blue-600 text-white">
                {text[currentLanguage].current}
              </Badge>
              현재 모듈
            </h3>
            {renderModuleCard(currentModule, false, true)}
          </div>
        )}

        {/* Alternative Modules */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {text[currentLanguage].alternatives} ({alternativeModules.length}개)
          </h3>
          
          {alternativeModules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">{text[currentLanguage].noAlternatives}</p>
              <Button onClick={onGenerateNew} className="bg-purple-600 hover:bg-purple-700">
                <Zap className="w-4 h-4 mr-2" />
                AI로 새로 생성하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alternativeModules.map((module) => (
                <div key={module.id}>
                  {renderModuleCard(module, selectedAlternative?.id === module.id)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score Preview & Actions */}
      {selectedAlternative && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">{text[currentLanguage].preview}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {scorePreview && scorePreview > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : scorePreview && scorePreview < 0 ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : null}
                  <span className={`text-lg font-bold ${
                    scorePreview && scorePreview > 0 ? 'text-green-600' : 
                    scorePreview && scorePreview < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {scorePreview ? (scorePreview > 0 ? '+' : '') + scorePreview : '0'}점
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {scorePreview && scorePreview > 0 ? text[currentLanguage].scoreIncrease : 
                 scorePreview && scorePreview < 0 ? text[currentLanguage].scoreDecrease : 
                 '변화 없음'}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => onSelectModule(selectedAlternative)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {text[currentLanguage].apply}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Module Edit Modal */}
      <ModuleEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        moduleType={moduleType}
        currentModule={editingModule}
        currentLanguage={currentLanguage}
        onSave={handleSaveModule}
      />
    </div>
  );
};

export default ModuleImprovement;
