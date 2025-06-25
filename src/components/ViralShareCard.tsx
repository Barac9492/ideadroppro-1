
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Twitter, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ViralShareCardProps {
  grade: string;
  ideaTitle: string;
  userName?: string;
  currentLanguage: 'ko' | 'en';
}

const ViralShareCard: React.FC<ViralShareCardProps> = ({
  grade,
  ideaTitle,
  userName = 'Anonymous',
  currentLanguage
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const text = {
    ko: {
      myIdea: '내 아이디어',
      gotGrade: '등급을 받았어요!',
      tryYours: '당신도 도전해보세요',
      shareTwitter: 'Twitter 공유',
      shareKakao: '카카오톡 공유',
      downloadImage: '이미지 다운로드',
      website: 'idea-builder.com',
      hashtags: '#창업아이디어 #AI분석 #비즈니스모델',
      shareText: `🚀 내 창업 아이디어가 ${grade} 등급을 받았어요!\n\n"${ideaTitle}"\n\n당신의 아이디어도 AI에게 평가받아보세요! 👇`
    },
    en: {
      myIdea: 'My Idea',
      gotGrade: 'Got Grade!',
      tryYours: 'Try yours too',
      shareTwitter: 'Share on Twitter',
      shareKakao: 'Share on KakaoTalk',
      downloadImage: 'Download Image',
      website: 'idea-builder.com',
      hashtags: '#StartupIdea #AIAnalysis #BusinessModel',
      shareText: `🚀 My startup idea got ${grade} grade!\n\n"${ideaTitle}"\n\nGet your idea evaluated by AI too! 👇`
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text[currentLanguage].shareText)}&hashtags=${encodeURIComponent(text[currentLanguage].hashtags.replace('#', '').replace(/\s+/g, ','))}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnKakao = () => {
    // KakaoTalk sharing would require SDK integration
    // For now, copy to clipboard
    navigator.clipboard.writeText(text[currentLanguage].shareText + '\n' + window.location.origin);
    toast({
      title: currentLanguage === 'ko' ? '복사완료!' : 'Copied!',
      description: currentLanguage === 'ko' ? '카카오톡에 붙여넣기 하세요' : 'Paste in KakaoTalk',
    });
  };

  const downloadAsImage = async () => {
    // This would require html2canvas or similar library
    // For now, show success message
    toast({
      title: currentLanguage === 'ko' ? '이미지 생성 중...' : 'Generating image...',
      description: currentLanguage === 'ko' ? '곧 다운로드됩니다' : 'Download will start soon',
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'from-green-400 to-emerald-500';
    if (grade.includes('B')) return 'from-blue-400 to-cyan-500';
    if (grade.includes('C')) return 'from-yellow-400 to-orange-500';
    if (grade.includes('D')) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="space-y-4">
      {/* Shareable Card */}
      <Card 
        ref={cardRef}
        className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-xl max-w-md mx-auto"
      >
        <CardContent className="p-6 text-center space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">{text[currentLanguage].myIdea}</div>
            <div className={`text-6xl font-bold bg-gradient-to-r ${getGradeColor(grade)} bg-clip-text text-transparent`}>
              {grade}
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {text[currentLanguage].gotGrade}
            </div>
          </div>

          {/* Idea Title */}
          <div className="bg-white/70 rounded-lg p-3 border">
            <p className="text-sm font-medium text-gray-800 line-clamp-2">
              "{ideaTitle}"
            </p>
          </div>

          {/* User */}
          <div className="text-xs text-gray-500">
            by {userName}
          </div>

          {/* CTA */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-purple-700">
              {text[currentLanguage].tryYours}
            </p>
            <p className="text-xs text-gray-500">
              {text[currentLanguage].website}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </CardContent>
      </Card>

      {/* Share Buttons */}
      <div className="flex justify-center space-x-3">
        <Button
          onClick={shareOnTwitter}
          className="bg-sky-500 hover:bg-sky-600 text-white"
          size="sm"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        
        <Button
          onClick={shareOnKakao}
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          KakaoTalk
        </Button>

        <Button
          onClick={downloadAsImage}
          variant="outline"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          {text[currentLanguage].downloadImage}
        </Button>
      </div>
    </div>
  );
};

export default ViralShareCard;
