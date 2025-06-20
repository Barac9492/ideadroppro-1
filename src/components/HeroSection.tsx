
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Zap, TrendingUp, Users, Eye } from 'lucide-react';
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
      hero: '"이 아이디어, 진짜 투자받을 수 있을까?"',
      subtitle: 'GPT와 함께 리파인하고, 투자자도 보는 피드에 드랍해보세요.',
      cta: '지금 바로 아이디어 드랍하기',
      placeholder: '당신의 혁신적인 아이디어를 여기에 드랍하세요... (예: "배달 음식 포장 쓰레기를 줄이는 구독형 다회용 용기 서비스")',
      processing: 'GPT가 리파인하는 중...',
      dropNow: '아이디어 드랍',
      refining: '리파인 중...',
      stats: {
        ideas: '개의 아이디어',
        vcs: '명의 VC',
        active: '실시간 활성'
      }
    },
    en: {
      hero: '"Can this idea really get investment?"',
      subtitle: 'Refine with GPT and drop it on a feed that investors also watch.',
      cta: 'Drop Your Idea Right Now',
      placeholder: 'Drop your innovative idea here... (e.g., "Subscription-based reusable container service to reduce food delivery packaging waste")',
      processing: 'GPT is refining...',
      dropNow: 'Drop Idea',
      refining: 'Refining...',
      stats: {
        ideas: 'ideas',
        vcs: 'VCs',
        active: 'live now'
      }
    }
  };

  const handleDrop = async () => {
    if (!idea.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (!user) {
        // Show processing animation first, then redirect to auth
        setTimeout(() => {
          navigate('/auth', { state: { ideaText: idea.trim() } });
        }, 2000);
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
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Text */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            💡 {text[currentLanguage].hero}
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
                <span className="text-sm text-blue-200">
                  {500 - idea.length} characters remaining
                </span>
                
                <Button
                  onClick={handleDrop}
                  disabled={!idea.trim() || isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <Zap className="h-5 w-5 animate-pulse text-yellow-300" />
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

          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
