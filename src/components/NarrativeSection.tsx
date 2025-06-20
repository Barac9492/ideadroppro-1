
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
      mainQuote: 'VC들은 더 이상 미팅룸에서\n아이디어를 기다리지 않습니다.',
      subText: '이제, 여기서 찾습니다.',
      evolutionTitle: '아이디어도 진화해야 합니다',
      evolutionText: '우리는 메모장에서 노션으로, PPT에서 Figma로 발전했습니다.\n이제 아이디어 공유 방식도 새로운 시대입니다.',
      cta: '아이디어 제출하기',
      stats: {
        vcs: '23명의 VC가 매일 확인',
        ideas: '147개 아이디어 평가됨',
        investments: '12건의 실제 투자 연결'
      }
    },
    en: {
      mainQuote: 'VCs no longer wait for ideas\nin meeting rooms.',
      subText: 'Now, they find them here.',
      evolutionTitle: 'Ideas Must Evolve Too',
      evolutionText: 'We evolved from Notepad to Notion, from PPT to Figma.\nNow it\'s time for idea sharing to enter a new era.',
      cta: 'Submit Your Idea',
      stats: {
        vcs: '23 VCs check daily',
        ideas: '147 ideas evaluated',
        investments: '12 real investment connections'
      }
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Main Quote Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Quote className="w-12 h-12 text-gray-400 mx-auto mb-8" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
            {text[currentLanguage].mainQuote.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line}
              </div>
            ))}
          </h2>
          
          <p className="text-2xl md:text-3xl text-blue-600 font-semibold">
            {text[currentLanguage].subText}
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">{text[currentLanguage].stats.vcs}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">{text[currentLanguage].stats.ideas}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-700">{text[currentLanguage].stats.investments}</span>
            </div>
          </div>
        </div>

        {/* Evolution Story */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">
                {text[currentLanguage].evolutionTitle}
              </h3>
              
              <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
                {text[currentLanguage].evolutionText.split('\n').map((line, index) => (
                  <div key={index} className="mb-2">
                    {line}
                  </div>
                ))}
              </p>
            </div>

            {/* Evolution Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900">과거</h4>
                <p className="text-sm text-gray-600">메모장 → 노션</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900">전환</h4>
                <p className="text-sm text-gray-600">PPT → Figma</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900">현재</h4>
                <p className="text-sm text-gray-600">아이디어의 진화</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <Button
                onClick={onDropIdea}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 text-xl rounded-2xl shadow-lg"
              >
                <Zap className="w-6 h-6 mr-3" />
                {text[currentLanguage].cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarrativeSection;
