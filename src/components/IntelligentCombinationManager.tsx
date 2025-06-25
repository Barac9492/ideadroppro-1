
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useIntelligentCombination } from '@/hooks/useIntelligentCombination';
import { useModularIdeas } from '@/hooks/useModularIdeas';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Star, 
  Plus, 
  Minus,
  Lightbulb,
  Target,
  Award,
  ThumbsUp,
  Loader2
} from 'lucide-react';

interface IntelligentCombinationManagerProps {
  currentLanguage: 'ko' | 'en';
}

const IntelligentCombinationManager: React.FC<IntelligentCombinationManagerProps> = ({ 
  currentLanguage 
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [showOptimalResults, setShowOptimalResults] = useState(false);
  const [optimalCombinations, setOptimalCombinations] = useState<any[]>([]);

  const { modules } = useModularIdeas({ currentLanguage });
  const {
    selectedModules,
    setSelectedModules,
    currentScores,
    recommendations,
    topCombinations,
    loading,
    optimizing,
    findOptimalCombinations,
    saveCombination,
    submitFeedback
  } = useIntelligentCombination({ currentLanguage });

  const text = {
    ko: {
      title: '🧠 지능형 조합 엔진',
      currentCombination: '현재 조합',
      selectModules: '모듈 선택',
      combinationScores: '조합 점수',
      novelty: '신선도',
      complementarity: '상보성',
      marketability: '시장성',
      overall: '종합점수',
      recommendations: 'AI 추천',
      findOptimal: '최적 조합 찾기',
      topCombinations: '최고 평점 조합',
      saveCombination: '조합 저장',
      submitFeedback: '피드백 제출',
      rating: '평점',
      feedback: '피드백 (선택사항)',
      noModulesSelected: '모듈을 선택해주세요',
      minModulesRequired: '최소 2개 모듈이 필요합니다',
      confidenceScore: '신뢰도',
      reason: '추천 이유',
      moduleCount: '모듈 수',
      createdAt: '생성일',
      findingOptimal: 'AI가 최적 조합을 찾는 중...',
      optimalResults: '최적 조합 결과'
    },
    en: {
      title: '🧠 Intelligent Combination Engine',
      currentCombination: 'Current Combination',
      selectModules: 'Select Modules',
      combinationScores: 'Combination Scores',
      novelty: 'Novelty',
      complementarity: 'Complementarity',
      marketability: 'Marketability',
      overall: 'Overall Score',
      recommendations: 'AI Recommendations',
      findOptimal: 'Find Optimal Combinations',
      topCombinations: 'Top Rated Combinations',
      saveCombination: 'Save Combination',
      submitFeedback: 'Submit Feedback',
      rating: 'Rating',
      feedback: 'Feedback (Optional)',
      noModulesSelected: 'Please select modules',
      minModulesRequired: 'At least 2 modules required',
      confidenceScore: 'Confidence',
      reason: 'Reason',
      moduleCount: 'Module Count',
      createdAt: 'Created',
      findingOptimal: 'AI is finding optimal combinations...',
      optimalResults: 'Optimal Combination Results'
    }
  };

  const handleModuleToggle = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const handleFindOptimal = async () => {
    const results = await findOptimalCombinations();
    if (results && results.length > 0) {
      setOptimalCombinations(results);
      setShowOptimalResults(true);
    }
  };

  const handleSaveCombination = async () => {
    if (currentScores && selectedModules.length >= 2) {
      try {
        await saveCombination(selectedModules, currentScores);
      } catch (error) {
        console.error('Error saving combination:', error);
      }
    }
  };

  const handleSubmitFeedback = async (combinationId: string) => {
    if (selectedRating > 0) {
      try {
        await submitFeedback(combinationId, selectedRating, feedbackText);
        setSelectedRating(0);
        setFeedbackText('');
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 현재 조합 및 점수 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 모듈 선택 */}
          <div>
            <h3 className="font-medium mb-2">{text[currentLanguage].selectModules}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {modules.map((module) => (
                <Button
                  key={module.id}
                  variant={selectedModules.includes(module.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleModuleToggle(module.id)}
                  className="justify-start text-left h-auto py-2"
                >
                  <div className="flex items-center space-x-2">
                    {selectedModules.includes(module.id) ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                    <div>
                      <div className="text-xs font-medium">{module.module_type}</div>
                      <div className="text-xs text-gray-600 truncate max-w-24">
                        {module.content.substring(0, 30)}...
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* 현재 조합 표시 */}
          {selectedModules.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">{text[currentLanguage].currentCombination}</h3>
              <div className="flex flex-wrap gap-1">
                {selectedModules.map((moduleId) => {
                  const module = modules.find(m => m.id === moduleId);
                  return module ? (
                    <Badge key={moduleId} variant="secondary" className="text-xs">
                      {module.module_type}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* 조합 점수 */}
          {currentScores && (
            <div>
              <h3 className="font-medium mb-3">{text[currentLanguage].combinationScores}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{text[currentLanguage].novelty}</span>
                    <span className={getScoreColor(currentScores.novelty_score)}>
                      {currentScores.novelty_score.toFixed(1)}/5.0
                    </span>
                  </div>
                  <Progress value={(currentScores.novelty_score / 5) * 100} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{text[currentLanguage].complementarity}</span>
                    <span className={getScoreColor(currentScores.complementarity_score)}>
                      {currentScores.complementarity_score.toFixed(1)}/5.0
                    </span>
                  </div>
                  <Progress value={(currentScores.complementarity_score / 5) * 100} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{text[currentLanguage].marketability}</span>
                    <span className={getScoreColor(currentScores.marketability_score)}>
                      {currentScores.marketability_score.toFixed(1)}/5.0
                    </span>
                  </div>
                  <Progress value={(currentScores.marketability_score / 5) * 100} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{text[currentLanguage].overall}</span>
                    <span className={getScoreColor(currentScores.overall_score)}>
                      {currentScores.overall_score.toFixed(1)}/5.0
                    </span>
                  </div>
                  <Progress value={(currentScores.overall_score / 5) * 100} />
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button onClick={handleSaveCombination} className="flex-1">
                  <Award className="w-4 h-4 mr-2" />
                  {text[currentLanguage].saveCombination}
                </Button>
                <Button 
                  onClick={handleFindOptimal}
                  variant="outline"
                  disabled={optimizing}
                  className="flex-1"
                >
                  {optimizing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Target className="w-4 h-4 mr-2" />
                  )}
                  {text[currentLanguage].findOptimal}
                </Button>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">평가 중...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI 추천 */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>{text[currentLanguage].recommendations}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">
                        {rec.module_type}
                      </Badge>
                      <p className="text-sm font-medium">{rec.content.substring(0, 100)}...</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{text[currentLanguage].confidenceScore}</div>
                      <div className="text-sm font-medium">{rec.confidence_score.toFixed(0)}%</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{rec.reason}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleModuleToggle(rec.module_id)}
                    className="mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    추가
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최적 조합 결과 */}
      {showOptimalResults && optimalCombinations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{text[currentLanguage].optimalResults}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimalCombinations.map((combo, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">조합 #{index + 1}</h4>
                    <Badge variant="default">
                      점수: {combo.fitness?.toFixed(1) || 'N/A'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {combo.modules.map((moduleId: string) => {
                      const module = modules.find(m => m.id === moduleId);
                      return module ? (
                        <Badge key={moduleId} variant="secondary" className="text-xs">
                          {module.module_type}
                        </Badge>
                      ) : null;
                    })}
                  </div>

                  {combo.scores && (
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-600">신선도</div>
                        <div className="font-medium">{combo.scores.novelty_score?.toFixed(1)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">상보성</div>
                        <div className="font-medium">{combo.scores.complementarity_score?.toFixed(1)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">시장성</div>
                        <div className="font-medium">{combo.scores.marketability_score?.toFixed(1)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">종합</div>
                        <div className="font-medium">{combo.scores.overall_score?.toFixed(1)}</div>
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    onClick={() => setSelectedModules(combo.modules)}
                    className="mt-2 w-full"
                  >
                    이 조합 사용하기
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최고 평점 조합들 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>{text[currentLanguage].topCombinations}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCombinations.slice(0, 5).map((combo, index) => (
              <div key={combo.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="text-sm font-medium">
                      {text[currentLanguage].overall}: {combo.overall_score?.toFixed(1)}/5.0
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{combo.like_count || 0}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {combo.module_ids?.map((moduleId: string) => {
                    const module = modules.find(m => m.id === moduleId);
                    return module ? (
                      <Badge key={moduleId} variant="outline" className="text-xs">
                        {module.module_type}
                      </Badge>
                    ) : null;
                  })}
                </div>

                <div className="text-xs text-gray-600">
                  {new Date(combo.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentCombinationManager;
