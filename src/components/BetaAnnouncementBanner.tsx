
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';

interface BetaAnnouncementBannerProps {
  currentLanguage: 'ko' | 'en';
}

const BetaAnnouncementBanner: React.FC<BetaAnnouncementBannerProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      betaTitle: 'IdeaDrop Pro 오픈 베타',
      mainMessage: '세상에 없는 아이디어, 이제는 노션에만 묻어두지 마세요.',
      process: '아이디어 하나 → GPT로 점수 → VC에게 바로 노출',
      todayKeyword: '오늘의 키워드로 드랍하고, 점수 받고, 리믹스 받고, 투자자에게 픽되세요.'
    },
    en: {
      betaTitle: 'IdeaDrop Pro Open Beta',
      mainMessage: 'Don\'t let your unique ideas stay buried in Notion anymore.',
      process: 'One Idea → GPT Score → Direct VC Exposure',
      todayKeyword: 'Drop with today\'s keyword, get scored, get remixed, get picked by investors.'
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Badge className="bg-white/20 text-white border-white/30">
              🎉 {text[currentLanguage].betaTitle}
            </Badge>
          </div>
          
          <h2 className="text-lg md:text-xl font-bold mb-2">
            {text[currentLanguage].mainMessage}
          </h2>
          
          <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
            <Zap className="w-4 h-4" />
            <span className="font-medium">{text[currentLanguage].process}</span>
          </div>
          
          <p className="text-sm text-purple-100 mt-2">
            🧠 {text[currentLanguage].todayKeyword}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaAnnouncementBanner;
