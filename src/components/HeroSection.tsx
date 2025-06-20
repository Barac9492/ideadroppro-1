
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Users, Eye, Target, Crown, Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => Promise<void>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [idea, setIdea] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const text = {
    ko: {
      heroA: '메모장에만 묻혀둔 아이디어,\n오늘 투자자가 먼저 연락 오게 만들어 보세요.',
      heroB: 'GPT가 10점 만점을 주면, 실제 투자자가 연락드립니다.\n이번 주 Top3 안에 도전하세요.',
      subtitle: 'AI 점수 → 랭킹 시스템 → 실제 투자자 매칭',
      cta: '지금 바로 10점 도전하기',
      placeholder: '당신의 혁신적인 아이디어를 여기에 드랍하세요... (예: "배달 음식 포장 쓰레기를 줄이는 구독형 다회용 용기 서비스")',
      processing: 'GPT가 10점 만점으로 채점 중...',
      dropNow: '점수 받기',
      refining: '채점 중...',
      todayMission: '오늘의 GPT 미션',
      missionDesc: '이 키워드로 150자 아이디어 작성 시 자동 VC 제출',
      hotKeyword: '🔥 오늘의 핫 키워드',
      timeLeft: '남은 시간',
      vcPick: 'VC 픽업 확률',
      stats: {
        ideas: '개의 아이디어',
        vcs: '명의 VC',
        active: '실시간 활성',
        success: '투자 연결 성공률'
      }
    },
    en: {
      heroA: 'Turn your buried notepad ideas\ninto investor outreach today.',
      heroB: 'When GPT gives you 10/10, real investors will contact you.\nChallenge for this week\'s Top 3.',
      subtitle: 'AI Score → Ranking System → Real Investor Matching',
      cta: 'Challenge for 10 Points Now',
      placeholder: 'Drop your innovative idea here... (e.g., "Subscription-based reusable container service to reduce food delivery packaging waste")',
      processing: 'GPT is scoring out of 10...',
      dropNow: 'Get Score',
      refining: 'Scoring...',
      todayMission: 'Today\'s GPT Mission',
      missionDesc: 'Auto VC submission chance for 150-char idea with this keyword',
      hotKeyword: '🔥 Today\'s Hot Keyword',
      timeLeft: 'Time Left',
      vcPick: 'VC Pickup Rate',
      stats: {
        ideas: 'ideas',
        vcs: 'VCs',
        active: 'live now',
        success: 'investment success rate'
      }
    }
  };

  // Simulate today's mission data
  const todayMission = {
    keyword: currentLanguage === 'ko' ? 'AI × 헬스케어' : 'AI × Healthcare',
    timeLeft: '14:32:45',
    vcPickupRate: '73%'
  };

  const handleDrop = async () => {
    if (!idea.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (!user) {
        // Show processing animation first, then redirect to auth
        setTimeout(() => {
          navigate('/auth', { state: { ideaText: idea.trim() } });
        }, 3000); // Longer animation for scoring effect
      } else {
        await onIdeaDrop(idea.trim());
        setIdea('');
      }
    } catch (error) {
      console.error('Error dropping idea:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Today's Mission Banner */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-400/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-100">
                  {text[currentLanguage].todayMission}
                </h3>
                <p className="text-yellow-200/80 text-sm">
                  {text[currentLanguage].missionDesc}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-center">
              <div>
                <Badge className="bg-yellow-500 text-black mb-2">
                  {text[currentLanguage].hotKeyword}
                </Badge>
                <div className="text-xl font-bold text-yellow-100">
                  {todayMission.keyword}
                </div>
              </div>
              <div>
                <div className="text-sm text-yellow-200/80">{text[currentLanguage].timeLeft}</div>
                <div className="text-lg font-mono text-yellow-100">{todayMission.timeLeft}</div>
              </div>
              <div>
                <div className="text-sm text-yellow-200/80">{text[currentLanguage].vcPick}</div>
                <div className="text-lg font-bold text-green-400">{todayMission.vcPickupRate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>147 {text[currentLanguage].stats.ideas}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>23 {text[currentLanguage].stats.vcs}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>89 {text[currentLanguage].stats.active}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>12% {text[currentLanguage].stats.success}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Strong Hero Text - A/B Version A */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
            💡 {text[currentLanguage].heroA.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line}
              </div>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            {text[currentLanguage].subtitle}
          </p>

          {/* Idea Drop Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="space-y-6">
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={text[currentLanguage].placeholder}
                className="min-h-[120px] bg-white/90 text-gray-900 border-0 text-lg resize-none focus:ring-2 focus:ring-purple-400"
                maxLength={500}
                disabled={isProcessing}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-200">
                    {500 - idea.length} characters remaining
                  </span>
                  {idea.length >= 150 && (
                    <Badge className="bg-green-500 text-white">
                      <Gift className="w-3 h-3 mr-1" />
                      미션 달성!
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={handleDrop}
                  disabled={!idea.trim() || isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <Target className="h-5 w-5 animate-pulse text-yellow-300" />
                      <span>{text[currentLanguage].refining}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>{text[currentLanguage].dropNow}</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>실시간 GPT 분석</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>투자자 피드 노출</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>커뮤니티 피드백</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>랭킹 시스템</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
