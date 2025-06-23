
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Zap, Target, Lightbulb, CheckCircle, AlertCircle, Loader2, Brain, Sparkles, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AIInstantFeedbackProps {
  ideaData: any;
  currentLanguage: 'ko' | 'en';
  onContinueToRemix: () => void;
  onSubmitToCommunity: () => void;
}

const AIInstantFeedback: React.FC<AIInstantFeedbackProps> = ({
  ideaData,
  currentLanguage,
  onContinueToRemix,
  onSubmitToCommunity
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const text = {
    ko: {
      analyzing: 'AI가 당신의 구체화된 아이디어를 심층 분석 중입니다...',
      complete: '🎉 AI 심층 분석 완료!',
      yourIdea: '당신의 완성된 아이디어',
      aiEvaluation: 'AI 종합 평가',
      moduleAnalysis: '모듈별 분석',
      strengths: '강점',
      improvements: '개선 포인트',
      nextSteps: '다음 단계를 선택하세요',
      continueRemix: '🎨 리믹스 스튜디오로',
      submitCommunity: '🚀 커뮤니티에 공개',
      vcInterest: 'VC 관심도',
      remixCredit: '리믹스 크레딧 획득!',
      analysisError: 'AI 분석 중 오류가 발생했습니다',
      retryAnalysis: '다시 분석하기',
      conversationInsights: '대화 인사이트',
      overallGrade: '종합 등급'
    },
    en: {
      analyzing: 'AI is conducting in-depth analysis of your refined idea...',
      complete: '🎉 AI In-depth Analysis Complete!',
      yourIdea: 'Your Completed Idea',
      aiEvaluation: 'AI Comprehensive Evaluation',
      moduleAnalysis: 'Module Analysis',
      strengths: 'Strengths',
      improvements: 'Areas for Improvement',
      nextSteps: 'Choose your next step',
      continueRemix: '🎨 To Remix Studio',
      submitCommunity: '🚀 Publish to Community',
      vcInterest: 'VC Interest Level',
      remixCredit: 'Remix Credits Earned!',
      analysisError: 'Error occurred during AI analysis',
      retryAnalysis: 'Retry Analysis',
      conversationInsights: 'Conversation Insights',
      overallGrade: 'Overall Grade'
    }
  };

  const calculateOverallGrade = (modules: any, score: number) => {
    const moduleCount = Object.keys(modules || {}).length;
    const completionBonus = moduleCount >= 4 ? 1 : 0;
    const scoreBonus = score >= 7 ? 1 : score >= 5 ? 0.5 : 0;
    
    const totalPoints = completionBonus + scoreBonus;
    
    if (totalPoints >= 1.8) return { grade: 'A+', color: 'text-green-600 bg-green-100', description: '뛰어남' };
    if (totalPoints >= 1.5) return { grade: 'A', color: 'text-green-600 bg-green-100', description: '우수함' };
    if (totalPoints >= 1.2) return { grade: 'B+', color: 'text-blue-600 bg-blue-100', description: '좋음' };
    if (totalPoints >= 1.0) return { grade: 'B', color: 'text-blue-600 bg-blue-100', description: '양호함' };
    if (totalPoints >= 0.7) return { grade: 'C+', color: 'text-yellow-600 bg-yellow-100', description: '보통' };
    if (totalPoints >= 0.5) return { grade: 'C', color: 'text-yellow-600 bg-yellow-100', description: '개선 필요' };
    return { grade: 'D', color: 'text-red-600 bg-red-100', description: '많은 개선 필요' };
  };

  const calculateVCInterest = (modules: any, score: number) => {
    const moduleCount = Object.keys(modules || {}).length;
    let interest = 'Low';
    let color = 'text-gray-600 bg-gray-100';
    
    if (moduleCount >= 4 && score >= 7) {
      interest = 'High';
      color = 'text-green-600 bg-green-100';
    } else if (moduleCount >= 3 && score >= 6) {
      interest = 'Medium';
      color = 'text-blue-600 bg-blue-100';
    } else if (moduleCount >= 2 && score >= 5) {
      interest = 'Moderate';
      color = 'text-yellow-600 bg-yellow-100';
    }
    
    return { interest, color };
  };

  const performEnhancedAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);

      console.log('Enhanced AI analysis starting:', ideaData);

      // Get comprehensive analysis
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: {
          ideaText: `${ideaData.originalIdea}\n\n구체화된 모듈:\n${Object.entries(ideaData.modules || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}`,
          language: currentLanguage,
          context: 'comprehensive'
        }
      });

      if (analysisError) throw analysisError;

      // Get detailed insights
      const { data: insightsData } = await supabase.functions.invoke('analyze-user-response', {
        body: {
          originalIdea: ideaData.originalIdea,
          userAnswer: Object.values(ideaData.modules || {}).join('\n'),
          moduleType: 'comprehensive',
          conversationHistory: ideaData.chatHistory || [],
          language: currentLanguage
        }
      });

      console.log('Analysis results:', { analysisData, insightsData });

      const score = analysisData?.score || 6.5;
      const overallGrade = calculateOverallGrade(ideaData.modules, score);
      const vcInterest = calculateVCInterest(ideaData.modules, score);

      const comprehensiveAnalysis = {
        score: score,
        overallGrade: overallGrade,
        vcInterest: vcInterest,
        strengths: [
          ...(analysisData?.pitchPoints || []),
          currentLanguage === 'ko' ? '체계적인 아이디어 구체화 완료' : 'Systematic idea development completed',
          currentLanguage === 'ko' ? 'AI 코칭을 통한 다각도 분석' : 'Multi-perspective analysis through AI coaching'
        ],
        improvements: [
          ...(analysisData?.improvements || []),
          ...(insightsData?.suggestions || [])
        ],
        remixCredits: Math.floor(Object.keys(ideaData.modules || {}).length * 1.5) + 3,
        conversationInsights: insightsData?.insights || (currentLanguage === 'ko' ? '훌륭한 대화형 구체화 과정이었습니다!' : 'Excellent interactive development process!'),
        moduleCompleteness: Object.keys(ideaData.modules || {}).length
      };

      setAnalysis(comprehensiveAnalysis);

    } catch (error) {
      console.error('Enhanced AI analysis error:', error);
      setAnalysisError(error.message || 'Analysis failed');
      
      // Enhanced fallback analysis
      const score = 7.0;
      const overallGrade = calculateOverallGrade(ideaData.modules, score);
      const vcInterest = calculateVCInterest(ideaData.modules, score);
      
      const fallbackAnalysis = {
        score: score,
        overallGrade: overallGrade,
        vcInterest: vcInterest,
        strengths: [
          currentLanguage === 'ko' ? 'AI 코칭을 통한 체계적 구체화' : 'Systematic refinement through AI coaching',
          currentLanguage === 'ko' ? '다양한 비즈니스 모듈 완성' : 'Comprehensive business modules completed',
          currentLanguage === 'ko' ? '실현 가능한 아이디어 발전' : 'Feasible idea development'
        ],
        improvements: [
          currentLanguage === 'ko' ? '시장 검증 및 테스트 필요' : 'Market validation needed',
          currentLanguage === 'ko' ? '경쟁 분석 심화' : 'Deeper competitive analysis'
        ],
        remixCredits: 5,
        conversationInsights: currentLanguage === 'ko' ? '구체화 과정이 우수했습니다!' : 'Excellent development process!',
        moduleCompleteness: Object.keys(ideaData.modules || {}).length
      };
      setAnalysis(fallbackAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    performEnhancedAIAnalysis();
  }, [ideaData, currentLanguage]);

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].analyzing}
          </h2>
          
          <div className="max-w-md mx-auto bg-purple-50 rounded-xl p-4 mb-6">
            <p className="text-purple-800 font-medium mb-2">"{ideaData.originalIdea}"</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          {analysisError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 mb-3">{text[currentLanguage].analysisError}</p>
              <Button onClick={performEnhancedAIAnalysis} variant="outline" size="sm">
                <Loader2 className="w-4 h-4 mr-2" />
                {text[currentLanguage].retryAnalysis}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white p-6">
        <div className="flex items-center space-x-3 mb-3">
          <CheckCircle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{text[currentLanguage].complete}</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-3 flex items-center space-x-3">
            <Award className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">등급: {analysis?.overallGrade?.grade}</span>
          </div>
          <div className="bg-white/20 rounded-xl p-3 flex items-center space-x-3">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">{text[currentLanguage].remixCredit}: +{analysis?.remixCredits}</span>
          </div>
          <div className="bg-white/20 rounded-xl p-3 flex items-center space-x-3">
            <Brain className="w-5 h-5 text-purple-300" />
            <span className="font-semibold">모듈: {analysis?.moduleCompleteness}개</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Enhanced Idea Preview */}
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
              {text[currentLanguage].yourIdea}
            </h3>
            
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-lg text-gray-800 font-medium mb-4">"{ideaData.originalIdea}"</p>
              
              {ideaData.modules && Object.keys(ideaData.modules).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 mb-3">{text[currentLanguage].moduleAnalysis}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(ideaData.modules || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-purple-700 capitalize">
                            {key.replace('_', ' ')}
                          </div>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            완료 ✓
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-800 leading-relaxed">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conversation Insights */}
            {analysis?.conversationInsights && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {text[currentLanguage].conversationInsights}
                </h4>
                <p className="text-green-700 text-sm">{analysis.conversationInsights}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI 평가 결과 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
              {text[currentLanguage].aiEvaluation}
            </h3>

            {/* 종합 등급 및 VC 관심도 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 px-6 py-4 rounded-2xl ${analysis?.overallGrade?.color}`}>
                  {analysis?.overallGrade?.grade}
                </div>
                <div className="text-sm text-gray-600 mb-1">{text[currentLanguage].overallGrade}</div>
                <div className="text-xs text-gray-500">{analysis?.overallGrade?.description}</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 px-4 py-4 rounded-2xl ${analysis?.vcInterest?.color}`}>
                  {analysis?.vcInterest?.interest}
                </div>
                <div className="text-sm text-gray-600">{text[currentLanguage].vcInterest}</div>
              </div>
            </div>

            {/* 강점과 개선점 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {text[currentLanguage].strengths}
                </h4>
                <ul className="space-y-2">
                  {(analysis?.strengths || []).map((strength: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {text[currentLanguage].improvements}
                </h4>
                <ul className="space-y-2">
                  {(analysis?.improvements || []).map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Next Steps */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {text[currentLanguage].nextSteps}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={onContinueToRemix}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold"
                size="lg"
              >
                {text[currentLanguage].continueRemix}
                <Zap className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                onClick={onSubmitToCommunity}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-6 text-lg font-semibold"
                size="lg"
              >
                {text[currentLanguage].submitCommunity}
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInstantFeedback;
