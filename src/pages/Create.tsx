
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import SimpleTopBar from '@/components/SimpleTopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, ArrowRight, Sparkles, Gift } from 'lucide-react';

const Create = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [ideaText, setIdeaText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial idea from navigation state
  useEffect(() => {
    if (location.state?.initialIdea) {
      setIdeaText(location.state.initialIdea);
    }
  }, [location.state]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { returnTo: '/create', initialIdea: ideaText } });
    }
  }, [user, navigate, ideaText]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleQuickStart = async () => {
    if (!ideaText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Navigate to a simple results page or show results inline
      console.log('Quick processing:', ideaText);
      setIsSubmitting(false);
      
      // For now, just show a success message
      alert(`아이디어 처리 완료: ${ideaText}`);
    }, 2000);
  };

  const handleDetailedAnalysis = () => {
    if (!ideaText.trim()) return;
    
    // Navigate to the detailed analysis flow
    navigate('/create/detailed', { 
      state: { 
        initialIdea: ideaText.trim(),
        autoStartQuestions: true 
      } 
    });
  };

  const text = {
    ko: {
      title: '💡 아이디어 만들기',
      subtitle: '간단하게 시작하세요! 30초 만에 AI 분석을 받아보거나 상세하게 발전시켜보세요',
      placeholder: '어떤 아이디어든 환영합니다!\n\n예시:\n• "배달음식 포장지를 재활용하는 앱"\n• "AI로 반려동물 건강 체크하는 서비스"\n• "중고차 실시간 경매 플랫폼"',
      quickStart: '🚀 30초 AI 분석',
      detailedAnalysis: '📝 상세 분석 & 발전',
      bonus: '첫 아이디어 보너스',
      tips: [
        '💡 구체적일수록 더 좋은 분석 결과를 받을 수 있어요',
        '🎯 문제와 솔루션을 간단히 적어보세요',
        '🚀 Enter키로 빠른 제출도 가능해요'
      ]
    },
    en: {
      title: '💡 Create Idea',
      subtitle: 'Start simple! Get AI analysis in 30 seconds or develop it in detail',
      placeholder: 'Any idea is welcome!\n\nExamples:\n• "App to recycle food delivery packaging"\n• "AI pet health check service"\n• "Real-time used car auction platform"',
      quickStart: '🚀 30sec AI Analysis',
      detailedAnalysis: '📝 Detailed Analysis & Development',
      bonus: 'First Idea Bonus',
      tips: [
        '💡 More specific ideas get better analysis results',
        '🎯 Write problem and solution briefly',
        '🚀 Press Enter for quick submit'
      ]
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleQuickStart();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="pt-20">
        <UnifiedNavigation currentLanguage={currentLanguage} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {text[currentLanguage].title}
            </h1>
            <p className="text-xl text-gray-600">
              {text[currentLanguage].subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Bonus Banner */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-8 text-white text-center shadow-lg">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Gift className="w-6 h-6 animate-bounce" />
                <span className="text-xl font-bold">{text[currentLanguage].bonus}</span>
                <Gift className="w-6 h-6 animate-bounce" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-lg font-bold">+100 XP</div>
                  <div className="text-xs opacity-90">경험치</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-lg font-bold">무료 분석</div>
                  <div className="text-xs opacity-90">AI 평가</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-lg font-bold">VC 노출</div>
                  <div className="text-xs opacity-90">우선 추천</div>
                </div>
              </div>
            </div>

            {/* Main Input Card */}
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  <span>아이디어를 입력해주세요</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={text[currentLanguage].placeholder}
                  className="min-h-[200px] text-lg border-2 border-purple-100 focus:border-purple-300 resize-none rounded-xl"
                  maxLength={500}
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    💡 팁: Enter로 빠른 분석, Shift+Enter로 줄바꿈
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {ideaText.length}/500
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleQuickStart}
                    disabled={!ideaText.trim() || isSubmitting}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 text-lg shadow-lg"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI 분석 중...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        {text[currentLanguage].quickStart}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleDetailedAnalysis}
                    disabled={!ideaText.trim()}
                    variant="outline"
                    size="lg"
                    className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-bold py-4 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {text[currentLanguage].detailedAnalysis}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {text[currentLanguage].tips.map((tip, index) => (
                <Card key={index} className="bg-white/50 border border-purple-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-700">{tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
