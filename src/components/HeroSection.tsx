
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Users, Eye, Target, Clock, ArrowRight } from 'lucide-react';
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
      heroTitle: '아이디어를 제출하고\n투자자에게 노출되세요',
      heroSubtitle: '매일 바뀌는 키워드에 맞춰 아이디어를 제출하면, GPT가 평가하고 VC들이 먼저 연락합니다.',
      mainCTA: '아이디어 제출하기',
      secondaryCTA: '다른 아이디어 보기',
      todayKeyword: '오늘의 키워드',
      deadline: '마감까지',
      placeholder: '예: 병원 예약 취소로 생긴 빈 자리를 AI가 실시간으로 매칭해주는 플랫폼',
      getScore: 'GPT 평가받기',
      processing: '평가 중...',
      scoreResult: 'GPT 평가',
      vcExposed: '투자자 피드에 등록완료',
      vcInterest: 'VC 관심',
      remixes: '리믹스',
      viewMore: '다른 아이디어 보기',
      stats: {
        evaluated: '건 평가됨',
        vcInterest: '건 VC 관심',
        activeVCs: '명 VC 활동중'
      }
    },
    en: {
      heroTitle: 'Submit Your Ideas and\nGet Exposed to Investors',
      heroSubtitle: 'Submit ideas based on daily keywords, get evaluated by GPT, and have VCs contact you first.',
      mainCTA: 'Submit Idea',
      secondaryCTA: 'View Other Ideas',
      todayKeyword: 'Today\'s Keyword',
      deadline: 'Deadline',
      placeholder: 'e.g., Platform that uses AI to match real-time available slots from hospital appointment cancellations',
      getScore: 'Get GPT Score',
      processing: 'Evaluating...',
      scoreResult: 'GPT Score',
      vcExposed: 'Added to investor feed',
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

  const todayKeyword = currentLanguage === 'ko' ? 'AI × 헬스케어' : 'AI × Healthcare';
  const timeLeft = '14:32:45';

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (!user) {
        setTimeout(() => {
          navigate('/auth', { state: { ideaText: idea.trim() } });
        }, 2000);
      } else {
        await onIdeaDrop(idea.trim());
        const score = Math.floor(Math.random() * 30 + 70) / 10;
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
    const element = document.querySelector('[data-section="live-feed"]');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80')`
    }}>
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Live Stats */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 flex items-center space-x-6 text-sm text-white">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>145 {text[currentLanguage].stats.evaluated}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>12 {text[currentLanguage].stats.vcInterest}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>23 {text[currentLanguage].stats.activeVCs}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showResult ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                  {text[currentLanguage].heroTitle.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                  {text[currentLanguage].heroSubtitle}
                </p>
              </div>

              {/* Today's Keyword Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <Badge className="bg-blue-600 text-white mb-2">
                        {text[currentLanguage].todayKeyword}
                      </Badge>
                      <div className="text-2xl font-bold text-gray-900">
                        {todayKeyword}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">{text[currentLanguage].deadline}</div>
                      <div className="text-lg font-mono text-gray-900">{timeLeft}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Section */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 max-w-2xl mx-auto">
                <Textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={text[currentLanguage].placeholder}
                  className="min-h-[120px] bg-white text-gray-900 border-gray-200 text-lg resize-none focus:ring-2 focus:ring-blue-500 mb-4"
                  maxLength={150}
                  disabled={isProcessing}
                />
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-600">
                    {150 - idea.length}자 남음
                  </span>
                  {idea.length >= 50 && (
                    <Badge className="bg-green-600 text-white">
                      제출 가능
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={idea.length < 50 || isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-xl disabled:opacity-50 mb-4"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{text[currentLanguage].processing}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>{text[currentLanguage].getScore}</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Secondary CTA */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleViewExamples}
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-2 bg-transparent"
                >
                  {text[currentLanguage].secondaryCTA}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            /* Result Section */
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {gptScore?.toFixed(1)}점
                </div>
                <div className="text-xl text-gray-800 mb-4">
                  {text[currentLanguage].scoreResult}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-lg text-green-800">
                    {text[currentLanguage].vcExposed}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">{text[currentLanguage].vcInterest}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-sm text-gray-600">{text[currentLanguage].remixes}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">#{Math.floor(Math.random() * 20) + 1}</div>
                  <div className="text-sm text-gray-600">실시간 랭킹</div>
                </div>
              </div>

              <Button
                onClick={() => handleViewExamples()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl"
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
