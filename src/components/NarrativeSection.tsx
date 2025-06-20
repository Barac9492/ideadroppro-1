
import React from 'react';
import { Button } from '@/components/ui/button';
import { Quote, Zap, TrendingUp, Users } from 'lucide-react';

interface NarrativeSectionProps {
  currentLanguage: 'ko' | 'en';
  onDropIdea: () => void;
}

const NarrativeSection: React.FC<NarrativeSectionProps> = ({ currentLanguage, onDropIdea }) => {
  const text = {
    ko: {
      mainQuote: 'VC들은 더 이상 미팅룸에서 아이디어를 기다리지 않습니다.\n이제, 여기서 찾습니다.',
      subQuote: '우리는 노션이 생기기 전, 메모장을 썼고\nFigma가 없던 시절, PPT로 디자인했습니다.\n이제, 아이디어도 진화해야죠.',
      cta: '오늘 아이디어 드랍하기 – 투자자도 보고 있습니다',
      stats: {
        vcs: '23명의 VC가 매일 확인',
        ideas: '147개 아이디어 평가됨',
        investments: '12건의 실제 투자 연결'
      }
    },
    en: {
      mainQuote: 'VCs no longer wait for ideas in meeting rooms.\nNow, they find them here.',
      subQuote: 'We used Notepad before Notion existed,\ndesigned with PPT before Figma.\nNow, ideas must evolve too.',
      cta: 'Drop Your Idea Today – Investors Are Watching',
      stats: {
        vcs: '23 VCs check daily',
        ideas: '147 ideas evaluated',
        investments: '12 real investment connections'
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Main Quote Section */}
        <div className="text-center mb-16">
          <Quote className="w-16 h-16 text-purple-400 mx-auto mb-8 opacity-50" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            {text[currentLanguage].mainQuote.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line}
              </div>
            ))}
          </h2>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{text[currentLanguage].stats.vcs}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>{text[currentLanguage].stats.ideas}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>{text[currentLanguage].stats.investments}</span>
            </div>
          </div>
        </div>

        {/* Evolution Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-200">
                💬 {text[currentLanguage].subQuote.split('\n').map((line, index) => (
                  <div key={index} className="mb-2">
                    {line}
                  </div>
                ))}
              </h3>
            </div>

            {/* Evolution Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">과거</h4>
                <p className="text-sm text-gray-300">메모장 → 노션</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">전환</h4>
                <p className="text-sm text-gray-300">PPT → Figma</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">현재</h4>
                <p className="text-sm text-gray-300">아이디어의 진화</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <Button
                onClick={onDropIdea}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-12 py-4 text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Zap className="w-6 h-6 mr-3" />
                {text[currentLanguage].cta}
              </Button>
              
              <p className="text-sm text-gray-400 mt-4">
                * 실제 투자 연결 사례 多수 보유
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarrativeSection;
