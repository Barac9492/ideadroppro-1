
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import BetaAnnouncementBanner from '@/components/BetaAnnouncementBanner';
import LandingHero from '@/components/LandingHero';
import SocialProofSection from '@/components/SocialProofSection';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { submitIdea } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();
  const isMobile = useIsMobile();

  const handleIdeaDrop = async (ideaText: string) => {
    if (!user) {
      navigate('/auth', { state: { ideaText } });
      return;
    }
    
    try {
      await submitIdea(ideaText);
      await updateStreak();
      await scoreActions.keywordParticipation();
      
      updateMissionProgress('idea_submit');
      await awardXP(50, '아이디어 제출');
      
      // Redirect to progressive builder for elaboration
      navigate('/submit');
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  // Handle auth redirect with the custom hook
  useAuthRedirect({ onIdeaDrop: handleIdeaDrop });

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SimplifiedHeader 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {/* Desktop navigation at top */}
      {!isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="top"
        />
      )}
      
      {/* Beta Announcement Banner */}
      <BetaAnnouncementBanner currentLanguage={currentLanguage} />
      
      {/* Main Investment-focused Hero */}
      <LandingHero 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
      {/* Investment Success Social Proof */}
      <InvestmentSuccessSection currentLanguage={currentLanguage} />
      
      {/* Mobile navigation at bottom */}
      {isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="bottom"
        />
      )}
    </div>
  );
};

// Investment Success Stories Component
const InvestmentSuccessSection: React.FC<{ currentLanguage: 'ko' | 'en' }> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '실제 투자 연결 성공 사례',
      subtitle: '단순한 아이디어에서 시작해 실제 투자까지',
      cases: [
        {
          idea: '동네 카페 배달 서비스',
          investment: '5,000만원 시드 투자',
          vc: 'K 벤처파트너스'
        },
        {
          idea: 'AI 기반 펫케어 앱',
          investment: '2억원 프리시리즈A',
          vc: 'Blue Point Partners'
        },
        {
          idea: '대학생 과외 매칭 플랫폼',
          investment: '1억원 엔젤 투자',
          vc: '개인 엔젤 투자자'
        }
      ]
    },
    en: {
      title: 'Real Investment Success Stories',
      subtitle: 'From simple ideas to actual investments',
      cases: [
        {
          idea: 'Local cafe delivery service',
          investment: '$50M seed investment',
          vc: 'K Venture Partners'
        },
        {
          idea: 'AI-powered pet care app',
          investment: '$200M Pre-Series A',
          vc: 'Blue Point Partners'
        },
        {
          idea: 'College tutoring platform',
          investment: '$100M angel investment',
          vc: 'Individual Angel Investor'
        }
      ]
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {text[currentLanguage].cases.map((case_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {case_.idea}
                </h3>
                <div className="text-green-600 font-bold text-xl mb-2">
                  {case_.investment}
                </div>
                <div className="text-gray-600 text-sm">
                  {case_.vc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
