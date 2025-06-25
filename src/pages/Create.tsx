
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
import { Lightbulb, ArrowRight, Sparkles, Gift, FileText, Edit3 } from 'lucide-react';

const Create = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [ideaText, setIdeaText] = useState('');
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

  const handleStartAnalysis = () => {
    if (!ideaText.trim()) return;
    
    // Navigate directly to builder with auto-start
    navigate('/builder', { 
      state: { 
        initialIdea: ideaText.trim(),
        autoStart: true 
      } 
    });
  };

  const text = {
    ko: {
      title: '✍️ 상세한 아이디어 작성',
      subtitle: '더 구체적인 아이디어를 작성하여 정확한 AI 분석을 받으세요',
      placeholder: '아이디어를 자세히 설명해주세요...\n\n예시:\n• 문제 상황: 배달음식을 주문할 때마다 일회용 포장지가 너무 많이 나와서 환경 부담이 된다\n• 해결 아이디어: 재사용 가능한 포장 용기를 제공하는 배달 서비스\n• 작동 방식: 사용자가 용기를 반납하면 포인트를 적립해주고, 다음 주문 시 할인 혜택 제공\n• 타겟 고객: 환경을 생각하는 20-30대 직장인',
      analyzeButton: '🚀 AI 분석 시작하기',
      detailedFeatures: {
        title: '상세 작성의 장점',
        items: [
          '더 정확한 AI 분석 결과',
          '구체적인 비즈니스 모델 제안',
          '실현 가능성 높은 솔루션',
          '맞춤형 시장 분석 제공'
        ]
      },
      tips: [
        '💡 문제 상황을 구체적으로 설명하세요',
        '🎯 타겟 고객을 명확히 정의하세요',
        '⚡ 해결 방법을 상세히 적어보세요'
      ]
    },
    en: {
      title: '✍️ Detailed Idea Writing',
      subtitle: 'Write more specific ideas for accurate AI analysis',
      placeholder: 'Please describe your idea in detail...\n\nExample:\n• Problem: Too much disposable packaging from food delivery creates environmental burden\n• Solution: Delivery service with reusable packaging containers\n• How it works: Users get points for returning containers, discount for next order\n• Target: Environmentally conscious office workers in 20s-30s',
      analyzeButton: '🚀 Start AI Analysis',
      detailedFeatures: {
        title: 'Benefits of Detailed Writing',
        items: [
          'More accurate AI analysis',
          'Specific business model proposals',
          'Highly feasible solutions',
          'Customized market analysis'
        ]
      },
      tips: [
        '💡 Describe the problem specifically',
        '🎯 Clearly define target customers',
        '⚡ Detail your solution approach'
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
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleStartAnalysis();
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
            {/* Main Input Card */}
            <Card className="shadow-xl border-2 border-purple-200 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit3 className="w-6 h-6 text-purple-600" />
                  <span>상세한 아이디어 작성</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={text[currentLanguage].placeholder}
                  className="min-h-[300px] text-lg border-2 border-purple-100 focus:border-purple-300 resize-none rounded-xl"
                  maxLength={1000}
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    💡 팁: Cmd/Ctrl + Enter로 빠른 분석
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {ideaText.length}/1000
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleStartAnalysis}
                    disabled={!ideaText.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg shadow-lg w-full md:w-auto"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {text[currentLanguage].analyzeButton}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  {text[currentLanguage].detailedFeatures.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {text[currentLanguage].detailedFeatures.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <div className="grid md:grid-cols-3 gap-4">
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
