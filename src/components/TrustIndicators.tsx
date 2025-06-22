
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, CheckCircle, Crown, Users } from 'lucide-react';

interface TrustIndicatorsProps {
  currentLanguage: 'ko' | 'en';
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      mainTrust: '이미 12,847명의 혁신가들이 성공을 경험했습니다',
      verifiedBy: '검증된 신뢰',
      governmentSupport: '정부지원사업 연계',
      vcPartnership: 'VC 파트너십',
      secureService: '안전한 서비스',
      topUniversities: '명문대 출신 개발팀'
    },
    en: {
      mainTrust: '12,847 innovators have already experienced success',
      verifiedBy: 'Verified Trust',
      governmentSupport: 'Government Support',
      vcPartnership: 'VC Partnership',
      secureService: 'Secure Service',
      topUniversities: 'Top University Dev Team'
    }
  };

  const trustLogos = [
    { name: 'KAIST', icon: '🎓' },
    { name: 'Seoul National Univ', icon: '🏛️' },
    { name: 'Government Support', icon: '🏛️' },
    { name: 'VC Partners', icon: '💼' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Main Trust Message */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-lg font-bold text-gray-800">
            {text[currentLanguage].mainTrust}
          </span>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Trust Badges Grid - Korean Authority Appeal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-3 shadow-md border border-blue-200 text-center">
          <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            {text[currentLanguage].secureService}
          </Badge>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-md border border-green-200 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <Badge className="bg-green-100 text-green-700 text-xs">
            {text[currentLanguage].governmentSupport}
          </Badge>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-md border border-purple-200 text-center">
          <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <Badge className="bg-purple-100 text-purple-700 text-xs">
            {text[currentLanguage].vcPartnership}
          </Badge>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-md border border-yellow-200 text-center">
          <Users className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
            {text[currentLanguage].topUniversities}
          </Badge>
        </div>
      </div>

      {/* Authority Logos - Korean University/Institution Trust */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-center text-sm text-gray-600 mb-3 font-semibold">
          🏆 {text[currentLanguage].verifiedBy}
        </p>
        <div className="flex items-center justify-center space-x-6">
          {trustLogos.map((logo, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-1">{logo.icon}</div>
              <div className="text-xs text-gray-500 font-medium">{logo.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Statistics - Korean Competition Appeal */}
      <div className="mt-4 text-center">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 border border-red-200">
            <div className="text-xl font-bold text-red-600">98.7%</div>
            <div className="text-xs text-red-500">만족도</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <div className="text-xl font-bold text-blue-600">156개</div>
            <div className="text-xs text-blue-500">투자연결</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <div className="text-xl font-bold text-green-600">24시간</div>
            <div className="text-xs text-green-500">평균 응답</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
