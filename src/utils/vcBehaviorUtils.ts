
export interface VCBehaviorConfig {
  activeHours: {
    weekday: { start: number; end: number };
    weekend: { start: number; end: number };
  };
  onlineCount: {
    peak: { min: number; max: number };
    normal: { min: number; max: number };
    low: { min: number; max: number };
  };
  eventFrequency: {
    peak: { min: number; max: number }; // minutes
    normal: { min: number; max: number };
    low: { min: number; max: number };
  };
}

export const VC_BEHAVIOR_CONFIG: VCBehaviorConfig = {
  activeHours: {
    weekday: { start: 9, end: 18 }, // 9AM-6PM KST
    weekend: { start: 10, end: 16 }, // 10AM-4PM KST
  },
  onlineCount: {
    peak: { min: 8, max: 15 },    // Business hours
    normal: { min: 3, max: 8 },   // Evening
    low: { min: 1, max: 3 },      // Night/Early morning
  },
  eventFrequency: {
    peak: { min: 2, max: 5 },     // 2-5 minutes
    normal: { min: 10, max: 15 }, // 10-15 minutes
    low: { min: 30, max: 60 },    // 30-60 minutes
  },
};

export const getCurrentKSTTime = () => {
  const now = new Date();
  const kstOffset = 9 * 60; // KST is UTC+9
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (kstOffset * 60000));
};

export const getVCActivityLevel = (): 'peak' | 'normal' | 'low' => {
  const kstTime = getCurrentKSTTime();
  const hour = kstTime.getHours();
  const day = kstTime.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = day === 0 || day === 6;
  
  const activeHours = isWeekend 
    ? VC_BEHAVIOR_CONFIG.activeHours.weekend
    : VC_BEHAVIOR_CONFIG.activeHours.weekday;
  
  if (hour >= activeHours.start && hour < activeHours.end) {
    // Peak hours: 11AM-2PM and 3PM-5PM on weekdays
    if (!isWeekend && ((hour >= 11 && hour < 14) || (hour >= 15 && hour < 17))) {
      return 'peak';
    }
    return 'normal';
  }
  
  // Evening hours (6PM-9PM) are normal activity
  if (hour >= 18 && hour <= 21) {
    return 'normal';
  }
  
  return 'low';
};

export const getRealisticVCCount = (): number => {
  const activityLevel = getVCActivityLevel();
  const config = VC_BEHAVIOR_CONFIG.onlineCount[activityLevel];
  return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
};

export const getEventFrequencyMs = (): number => {
  const activityLevel = getVCActivityLevel();
  const config = VC_BEHAVIOR_CONFIG.eventFrequency[activityLevel];
  const minutes = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
  return minutes * 60 * 1000; // Convert to milliseconds
};

export const getTimeBasedEventTypes = (): Array<'reading' | 'interested' | 'remixed' | 'dm_request' | 'featured'> => {
  const hour = getCurrentKSTTime().getHours();
  
  if (hour >= 9 && hour < 12) {
    // Morning: mostly reading
    return ['reading', 'reading', 'interested', 'reading'];
  } else if (hour >= 12 && hour < 17) {
    // Afternoon: active engagement
    return ['interested', 'remixed', 'reading', 'interested', 'remixed'];
  } else if (hour >= 17 && hour < 21) {
    // Evening: premium activities
    return ['dm_request', 'featured', 'interested', 'remixed'];
  } else {
    // Night/early morning: minimal activity
    return ['reading', 'interested'];
  }
};
