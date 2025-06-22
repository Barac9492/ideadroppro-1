
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Eye, 
  Users, 
  Building2, 
  PlusCircle,
  ArrowRight,
  Sparkles,
  Timer
} from 'lucide-react';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubmissionCompleteState {
  ideaText: string;
  aiImage?: string;
  completionScore?: number;
  modules?: any;
}

const SubmissionComplete = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const state = location.state as SubmissionCompleteState;

  const text = {
    ko: {
      title: '아이디어 제출 완료!',
      subtitle: 'AI가 당신의 아이디어를 분석하고 VC들에게 전달합니다',
      analysisInProgress: 'AI 분석 진행 중...',
      analysisComplete: 'AI 분석 완료',
      vcMatching: 'VC 매칭',
      communityFeedback: '커뮤니티 피드백',
      nextSteps: '다음 단계',
      checkVCStatus: 'VC 매칭 상태 확인',
      submitMoreIdeas: '더 많은 아이디어 제출',
      getCommunityFeedback: '커뮤니티 피드백 받기',
      viewDashboard: '대시보드 보기',
      yourIdea: '제출한 아이디어',
      aiGenerated: 'AI 생성 이미지',
      completionBonus: '완성도 보너스',
      processing: '처리 중...',
      ready: '준비 완료'
    },
    en: {
      title: 'Idea Submitted Successfully!',
      subtitle: 'AI is analyzing your idea and presenting it to VCs',
      analysisInProgress: 'AI Analysis in Progress...',
      analysisComplete: 'AI Analysis Complete',
      vcMatching: 'VC Matching',
      communityFeedback: 'Community Feedback',
      nextSteps: 'Next Steps',
      checkVCStatus: 'Check VC Matching Status',
      submitMoreIdeas: 'Submit More Ideas',
      getCommunityFeedback: 'Get Community Feedback',
      viewDashboard: 'View Dashboard',
      yourIdea: 'Your Submitted Idea',
      aiGenerated: 'AI Generated Image',
      completionBonus: 'Completion Bonus',
      processing: 'Processing...',
      ready: 'Ready'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Simulate analysis progress
  useEffect(() => {
    const timer = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          setShowNextSteps(true);
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // Redirect if no state
  if (!state?.ideaText) {
    navigate('/submit');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <SimplifiedHeader 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {!isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="top"
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {text[currentLanguage].title}
          </h1>
          <p className="text-gray-600 text-lg">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Progress Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>{text[currentLanguage].analysisInProgress}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>AI 분석 진행률</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
            </div>

            {/* Status Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                analysisProgress >= 30 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  analysisProgress >= 30 ? 'bg-green-500 text-white' : 'bg-gray-300'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{text[currentLanguage].analysisComplete}</p>
                  <p className="text-xs text-gray-500">
                    {analysisProgress >= 30 ? text[currentLanguage].ready : text[currentLanguage].processing}
                  </p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                analysisProgress >= 70 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  analysisProgress >= 70 ? 'bg-blue-500 text-white' : 'bg-gray-300'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{text[currentLanguage].vcMatching}</p>
                  <p className="text-xs text-gray-500">
                    {analysisProgress >= 70 ? text[currentLanguage].ready : text[currentLanguage].processing}
                  </p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                analysisProgress >= 100 ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  analysisProgress >= 100 ? 'bg-purple-500 text-white' : 'bg-gray-300'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{text[currentLanguage].communityFeedback}</p>
                  <p className="text-xs text-gray-500">
                    {analysisProgress >= 100 ? text[currentLanguage].ready : text[currentLanguage].processing}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Idea Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submitted Idea */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>{text[currentLanguage].yourIdea}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {state.ideaText}
              </p>
              {state.completionScore && (
                <div className="mt-4 flex items-center space-x-2">
                  <Badge className="bg-green-500 text-white">
                    +{state.completionScore} {text[currentLanguage].completionBonus}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Generated Image */}
          {state.aiImage && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>{text[currentLanguage].aiGenerated}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={state.aiImage} 
                  alt="AI Generated" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Next Steps */}
        {showNextSteps && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-green-600" />
                <span>{text[currentLanguage].nextSteps}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate('/vcs')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-auto p-4 justify-start"
                >
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{text[currentLanguage].checkVCStatus}</div>
                      <div className="text-sm opacity-90">VC 관심도 확인하기</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/submit')}
                  variant="outline"
                  className="h-auto p-4 justify-start border-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <PlusCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{text[currentLanguage].submitMoreIdeas}</div>
                      <div className="text-sm text-gray-500">연속 제출로 더 많은 기회</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/ideas')}
                  variant="outline"
                  className="h-auto p-4 justify-start border-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{text[currentLanguage].getCommunityFeedback}</div>
                      <div className="text-sm text-gray-500">커뮤니티 의견 받기</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="h-auto p-4 justify-start border-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{text[currentLanguage].viewDashboard}</div>
                      <div className="text-sm text-gray-500">전체 진행 상황</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="bottom"
        />
      )}
    </div>
  );
};

export default SubmissionComplete;
