
import React, { useState } from 'react';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import CommunityRankingHub from '@/components/CommunityRankingHub';
import RemixCreditSystem from '@/components/RemixCreditSystem';
import VCConnectionHub from '@/components/VCConnectionHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Trophy, Coins, Target } from 'lucide-react';

const Community = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const text = {
    ko: {
      title: '커뮤니티',
      tabs: {
        ranking: '랭킹',
        credits: '크레딧',
        vc: 'VC 연결'
      }
    },
    en: {
      title: 'Community',
      tabs: {
        ranking: 'Rankings',
        credits: 'Credits',
        vc: 'VC Connect'
      }
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleVote = async (ideaId: string, type: 'like' | 'dislike') => {
    console.log(`Voting ${type} for idea ${ideaId}`);
    // 실제 투표 로직 구현
  };

  const handleComment = async (ideaId: string) => {
    console.log(`Opening comments for idea ${ideaId}`);
    // 댓글 모달 열기 로직
  };

  const handleShare = async (ideaId: string) => {
    console.log(`Sharing idea ${ideaId}`);
    // 공유 기능 구현
  };

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

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="ranking" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="ranking" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>{text[currentLanguage].tabs.ranking}</span>
            </TabsTrigger>
            <TabsTrigger value="credits" className="flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>{text[currentLanguage].tabs.credits}</span>
            </TabsTrigger>
            <TabsTrigger value="vc" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{text[currentLanguage].tabs.vc}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ranking">
            <CommunityRankingHub
              currentLanguage={currentLanguage}
              onVote={handleVote}
              onComment={handleComment}
              onShare={handleShare}
            />
          </TabsContent>

          <TabsContent value="credits">
            <RemixCreditSystem
              currentLanguage={currentLanguage}
              userId={user?.id}
            />
          </TabsContent>

          <TabsContent value="vc">
            <VCConnectionHub
              currentLanguage={currentLanguage}
              userId={user?.id}
            />
          </TabsContent>
        </Tabs>
      </div>

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

export default Community;
