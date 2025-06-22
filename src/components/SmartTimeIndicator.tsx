
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap } from 'lucide-react';
import { getSmartTimeDisplay, isLiveActivity } from '@/utils/timeDisplay';

interface SmartTimeIndicatorProps {
  timestamp: Date;
  currentLanguage: 'ko' | 'en';
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SmartTimeIndicator: React.FC<SmartTimeIndicatorProps> = ({
  timestamp,
  currentLanguage,
  showBadge = true,
  size = 'md'
}) => {
  const [timeInfo, setTimeInfo] = useState(() => getSmartTimeDisplay(timestamp, currentLanguage));
  const [isLive, setIsLive] = useState(() => isLiveActivity(timestamp));

  useEffect(() => {
    const updateTime = () => {
      setTimeInfo(getSmartTimeDisplay(timestamp, currentLanguage));
      setIsLive(isLiveActivity(timestamp));
    };

    // Update every 10 seconds for live activities, every minute for others
    const interval = isLive ? 10000 : 60000;
    const timer = setInterval(updateTime, interval);

    return () => clearInterval(timer);
  }, [timestamp, currentLanguage, isLive]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {isLive ? (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Zap className="w-3 h-3 text-green-600" />
          </div>
        ) : (
          <Clock className="w-3 h-3 text-gray-500" />
        )}
        <span className={`${timeInfo.color} ${sizeClasses[size]} font-medium`}>
          {timeInfo.display}
        </span>
      </div>

      {showBadge && timeInfo.badge && (
        <Badge 
          variant="secondary" 
          className={`text-xs px-2 py-0.5 ${
            timeInfo.freshness === 'live' 
              ? 'bg-green-100 text-green-700 border-green-200 animate-pulse' 
              : timeInfo.freshness === 'fresh'
              ? 'bg-blue-100 text-blue-700 border-blue-200'
              : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}
        >
          {timeInfo.badge}
        </Badge>
      )}
    </div>
  );
};

export default SmartTimeIndicator;
