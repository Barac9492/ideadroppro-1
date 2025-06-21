
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
      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-sm transition-shadow">
        <div className="text-xl font-bold text-blue-600 mb-1">{stats.remixCount}</div>
        <div className="text-xs text-blue-600 font-medium">{text[currentLanguage].remixes}</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-sm transition-shadow">
        <div className="text-xl font-bold text-emerald-600 mb-1">{stats.commentCount}</div>
        <div className="text-xs text-emerald-600 font-medium">{text[currentLanguage].comments}</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:shadow-sm transition-shadow">
        <div className="text-xl font-bold text-purple-600 mb-1">{stats.dmRequests}</div>
        <div className="text-xs text-purple-600 font-medium">{text[currentLanguage].dmRequests}</div>
      </div>
      <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:shadow-sm transition-shadow">
        <div className="text-xl font-bold text-orange-600 mb-1">{stats.successfulInvestments}</div>
        <div className="text-xs text-orange-600 font-medium">{text[currentLanguage].investments}</div>
      </div>
    </div>
  );
};

export default VCStatsDisplay;
