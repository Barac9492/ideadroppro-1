
import React from 'react';

interface VCStats {
  remixCount: number;
  commentCount: number;
  dmRequests: number;
  successfulInvestments: number;
}

interface VCStatsDisplayProps {
  stats: VCStats;
  currentLanguage: 'ko' | 'en';
}

const VCStatsDisplay: React.FC<VCStatsDisplayProps> = ({ stats, currentLanguage }) => {
  const text = {
    ko: {
      remixes: '리믹스',
      comments: '코멘트',
      investments: '투자',
      dmRequests: 'DM 요청'
    },
    en: {
      remixes: 'Remixes',
      comments: 'Comments', 
      investments: 'Investments',
      dmRequests: 'DM Requests'
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="text-lg font-bold text-blue-600">{stats.remixCount}</div>
        <div className="text-xs text-blue-600 font-medium">{text[currentLanguage].remixes}</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <div className="text-lg font-bold text-green-600">{stats.commentCount}</div>
        <div className="text-xs text-green-600 font-medium">{text[currentLanguage].comments}</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
        <div className="text-lg font-bold text-purple-600">{stats.dmRequests}</div>
        <div className="text-xs text-purple-600 font-medium">{text[currentLanguage].dmRequests}</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
        <div className="text-lg font-bold text-orange-600">{stats.successfulInvestments}</div>
        <div className="text-xs text-orange-600 font-medium">{text[currentLanguage].investments}</div>
      </div>
    </div>
  );
};

export default VCStatsDisplay;
