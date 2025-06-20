
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Users, Eye, Target, Crown, Gift, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => Promise<void>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [idea, setIdea] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gptScore, setGptScore] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const text = {
    ko: {
      heroTitle: '아이디어, 평가받고 투자자에게 노출되세요',
      heroSubtitle: '매일 바뀌는 키워드로 GPT가 점수를 주고, VC가 먼저 연락드립니다.',
      mainCTA: '오늘 아이디어 드랍하기',
      secondaryCTA: '예시 아이디어 보기',
      todayKeyword: '오늘의 키워드',
      deadline: '마감까지',
      placeholder: '예: 병원 예약 취소 빈 자리를 AI로 실시간 노출해주는 플랫폼',
      getScore: 'GPT로 점수 받기',
      processing: 'GPT가 채점 중...',
      scoreResult: 'GPT 점수',
      vcExposed: '투자자 피드에 등록되었습니다',
      vcInterest: 'VC 관심 표시',
      remixes: '리믹스 수',
      viewMore: '다른 아이디어 보기',
      stats: {
        evaluated: '건 평가',
        vcInterest: '건 VC 관심',
        activeVCs: '명 VC 활동중'
      }
    },
    en: {
      heroTitle: 'Get Your Ideas Evaluated and Exposed to Investors',
      heroSubtitle: 'GPT scores your ideas with daily keywords, and VCs contact you first.',
      mainCTA: 'Drop Your Idea Today',
      secondaryCTA: 'View Example Ideas',
      todayKeyword: 'Today\'s Keyword',
      deadline: 'Deadline',
      placeholder: 'e.g., Platform that uses AI to expose real-time available slots from hospital appointment cancellations',
      getScore: 'Get GPT Score',
      processing: 'GPT is scoring...',
      scoreResult: 'GPT Score',
      vcExposed: 'Registered in investor feed',
      vcInterest: 'VC Interest',
      remixes: 'Remixes',
      viewMore: 'View Other Ideas',
      stats: {
        evaluated: 'evaluations',
        vcInterest: 'VC interests',
        activeVCs: 'VCs active'
      }
    }
  };

  // Mock today's mission data
  const todayKeyword = currentLanguage === 'ko' ? 'AI × 헬스케어' : 'AI × Healthcare';
  const timeLeft = '14:32:45';

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (!user) {
        // Show processing first, then redirect
        setTimeout(() => {
          navigate('/auth', { state: { ideaText: idea.trim() } });
        }, 3000);
      } else {
        await onIdeaDrop(idea.trim());
        // Simulate GPT scoring
        const score = Math.floor(Math.random() * 30 + 70) / 10; // 7.0-10.0 range
        setGptScore(score);
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewExamples = () => {
    // Scroll to live feed section
    const element = document.querySelector('[data-section="live-feed"]');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Live Stats */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>145 {text[currentLanguage].stats.evaluated}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-yellow-400" />
              <span>12 {text[currentLanguage].stats.vcInterest}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>23 {text[currentLanguage].stats.activeVCs}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
            🌍 {text[currentLanguage].heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            {text[currentLanguage].heroSubtitle}
          </p>

          {!showResult ? (
            <>
              {/* Today's Keyword Card */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-400/30">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <Badge className="bg-yellow-500 text-black mb-2">
                        🔥 {text[currentLanguage].todayKeyword}
                      </Badge>
                      <div className="text-2xl font-bold text-yellow-100">
                        {todayKeyword}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-200" />
                    <div>
                      <div className="text-sm text-yellow-200/80">{text[currentLanguage].deadline}</div>
                      <div className="text-lg font-mono text-yellow-100">{timeLeft}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
                <Textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={text[currentLanguage].placeholder}
                  className="min-h-[120px] bg-white/90 text-gray-900 border-0 text-lg resize-none focus:ring-2 focus:ring-purple-400 mb-4"
                  maxLength={150}
                  disabled={isProcessing}
                />
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-blue-200">
                    {150 - idea.length}자 남음
                  </span>
                  {idea.length >= 50 && (
                    <Badge className="bg-green-500 text-white">
                      <Gift className="w-3 h-3 mr-1" />
                      제출 가능!
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={idea.length < 50 || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-xl rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none mb-4"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <Target className="h-5 w-5 animate-pulse text-yellow-300" />
                      <span>{text[currentLanguage].processing}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-6 w-6" />
                      <span>{text[currentLanguage].getScore}</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Secondary CTA */}
              <Button
                variant="outline"
                onClick={handleViewExamples}
                className="border-white/30 text-white hover:bg-white/10 px-6 py-2"
              >
                {text[currentLanguage].secondaryCTA}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            /* Result Section */
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-green-400 mb-2">
                  {gptScore?.toFixed(1)}점
                </div>
                <div className="text-xl text-green-200 mb-4">
                  👏 {text[currentLanguage].scoreResult}
                </div>
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-lg text-white">
                    📤 {text[currentLanguage].vcExposed}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">3</div>
                  <div className="text-sm text-white">{text[currentLanguage].vcInterest}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">7</div>
                  <div className="text-sm text-white">{text[currentLanguage].remixes}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">#{Math.floor(Math.random() * 20) + 1}</div>
                  <div className="text-sm text-white">실시간 랭킹</div>
                </div>
              </div>

              <Button
                onClick={() => handleViewExamples()}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                {text[currentLanguage].viewMore}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
