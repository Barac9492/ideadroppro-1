
export const getSmartTimeDisplay = (timestamp: Date, currentLanguage: 'ko' | 'en' = 'ko') => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const text = {
    ko: {
      justNow: '방금',
      secondsAgo: '초 전',
      minutesAgo: '분 전',
      hoursAgo: '시간 전',
      daysAgo: '일 전',
      live: 'LIVE',
      fresh: '신선',
      recent: '최근'
    },
    en: {
      justNow: 'Just now',
      secondsAgo: 's ago',
      minutesAgo: 'm ago',
      hoursAgo: 'h ago',
      daysAgo: 'd ago',
      live: 'LIVE',
      fresh: 'Fresh',
      recent: 'Recent'
    }
  };

  // Real-time indicators
  if (diffSeconds < 10) {
    return {
      display: text[currentLanguage].justNow,
      badge: text[currentLanguage].live,
      freshness: 'live',
      color: 'text-green-600'
    };
  }

  if (diffSeconds < 60) {
    return {
      display: `${diffSeconds}${text[currentLanguage].secondsAgo}`,
      badge: text[currentLanguage].fresh,
      freshness: 'fresh',
      color: 'text-blue-600'
    };
  }

  if (diffMinutes < 60) {
    return {
      display: `${diffMinutes}${text[currentLanguage].minutesAgo}`,
      badge: diffMinutes < 10 ? text[currentLanguage].fresh : text[currentLanguage].recent,
      freshness: diffMinutes < 10 ? 'fresh' : 'recent',
      color: diffMinutes < 10 ? 'text-blue-600' : 'text-gray-600'
    };
  }

  if (diffHours < 24) {
    return {
      display: `${diffHours}${text[currentLanguage].hoursAgo}`,
      badge: text[currentLanguage].recent,
      freshness: 'recent',
      color: 'text-gray-600'
    };
  }

  return {
    display: `${diffDays}${text[currentLanguage].daysAgo}`,
    badge: '',
    freshness: 'old',
    color: 'text-gray-500'
  };
};

export const isLiveActivity = (timestamp: Date) => {
  const diffMs = new Date().getTime() - timestamp.getTime();
  return diffMs < 30000; // Less than 30 seconds is considered "live"
};
