
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Repeat, ArrowRight, TrendingUp, Eye } from 'lucide-react';

interface RemixExplanationSectionProps {
  currentLanguage: 'ko' | 'en';
}

const RemixExplanationSection: React.FC<RemixExplanationSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '리믹스란?',
      subtitle: '한 아이디어가 다른 사람 손에서 다시 태어나는 것',
      description: '누군가가 올린 아이디어를 기반으로, 보완하거나 재해석하거나 다른 버전으로 재조합할 수 있어요.',
      originalIdea: '원 아이디어',
      originalText: 'AI로 병원 빈자리 실시간 매칭',
      remix1: '피트니스 센터 예약에도 적용해보면?',
      remix2: '미용실, 네일숍 등 수요 변동 큰 업종에도 확장 가능',
      remix3: '빈자리 + 쿠폰까지 자동 제공하면?',
      influence: '리믹스를 많이 받는 아이디어는',
      influenceScore: '영향력 점수',
      visibility: '가 올라가고 더 많은 사람과 투자자의 눈에 띄게 됩니다.',
      coreLoop: '아이디어 → 리믹스 → 더 많은 리믹스 → 더 많은 노출 → VC의 관심',
      genetic: '리믹스는 이 플랫폼의 "유전자 복제"입니다.',
      spread: '내 아이디어가 살아있는 생명처럼 퍼져나가도록 해주세요.'
    },
    en: {
      title: 'What is a Remix?',
      subtitle: 'An idea reborn in someone else\'s hands',
      description: 'Based on someone\'s idea, you can complement, reinterpret, or recombine it into different versions.',
      originalIdea: 'Original Idea',
      originalText: 'AI real-time matching for hospital vacant slots',
      remix1: 'What about applying it to fitness center bookings?',
      remix2: 'Expandable to high-demand businesses like salons, nail shops',
      remix3: 'What if vacant slots automatically provide coupons too?',
      influence: 'Ideas that receive many remixes see their',
      influenceScore: 'influence score',
      visibility: 'increase and gain more visibility among people and investors.',
      coreLoop: 'Idea → Remix → More Remixes → More Exposure → VC Interest',
      genetic: 'Remixes are the "genetic replication" of this platform.',
      spread: 'Let your ideas spread like living organisms.'
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-purple-600 text-white mb-4 px-4 py-2">
              📣 REMIX 설명
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎛️ {text[currentLanguage].title}
            </h2>
            <p className="text-xl md:text-2xl text-purple-600 font-semibold mb-6">
              🎶 "{text[currentLanguage].subtitle}"
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {text[currentLanguage].description}
            </p>
          </div>

          {/* Example Flow */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">📎 예시</h3>
            
            {/* Original Idea */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">원</span>
                </div>
                <Badge className="bg-blue-600 text-white">
                  {text[currentLanguage].originalIdea}
                </Badge>
              </div>
              <p className="text-lg font-medium text-gray-800">
                "{text[currentLanguage].originalText}"
              </p>
            </div>

            {/* Remix Arrows and Ideas */}
            <div className="space-y-4">
              {[text[currentLanguage].remix1, text[currentLanguage].remix2, text[currentLanguage].remix3].map((remix, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 flex-1 border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Repeat className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">리믹스 {index + 1}</span>
                    </div>
                    <p className="text-gray-800">🧩 "{remix}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Influence Score Explanation */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12 border border-green-200">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-2">
                🎯 {text[currentLanguage].influence} <span className="font-bold text-green-600">'{text[currentLanguage].influenceScore}'</span>{text[currentLanguage].visibility}
              </p>
            </div>
          </div>

          {/* Core Loop */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">✨ 핵심 Loop</h3>
              <div className="text-lg md:text-xl font-medium leading-relaxed">
                {text[currentLanguage].coreLoop}
              </div>
              <div className="mt-6 text-gray-300">
                <p className="mb-2">🧬 {text[currentLanguage].genetic}</p>
                <p>{text[currentLanguage].spread}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixExplanationSection;
