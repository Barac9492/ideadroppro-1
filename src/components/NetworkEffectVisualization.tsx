
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Zap, GitBranch } from 'lucide-react';
import { useNetworkActivity } from '@/hooks/useNetworkActivity';

interface NetworkEffectVisualizationProps {
  currentLanguage: 'ko' | 'en';
}

const NetworkEffectVisualization: React.FC<NetworkEffectVisualizationProps> = ({ 
  currentLanguage 
}) => {
  const { activities, liveStats } = useNetworkActivity({ currentLanguage });

  const text = {
    ko: {
      liveNetwork: '실시간 네트워크',
      activeVCs: '활동중인 VC',
      recentRemixes: '최근 리믹스',
      todayIdeas: '오늘 아이디어',
      connections: '연결 성사',
      recentActivity: '최근 활동',
      minutesAgo: '분 전'
    },
    en: {
      liveNetwork: 'Live Network',
      activeVCs: 'Active VCs',
      recentRemixes: 'Recent Remixes',
      todayIdeas: 'Today\'s Ideas',
      connections: 'Connections Made',
      recentActivity: 'Recent Activity',
      minutesAgo: 'min ago'
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
    return `${minutes}${text[currentLanguage].minutesAgo}`;
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Live Stats Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Badge className="bg-green-100 text-green-700">
                {text[currentLanguage].liveNetwork}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {liveStats.activeVCs}
                </div>
                <div className="text-sm text-gray-600">
                  {text[currentLanguage].activeVCs}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {liveStats.remixesLast10Min}
                </div>
                <div className="text-sm text-gray-600">
                  {text[currentLanguage].recentRemixes}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {liveStats.ideasSubmittedToday}
                </div>
                <div className="text-sm text-gray-600">
                  {text[currentLanguage].todayIdeas}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {liveStats.connectionsMade}
                </div>
                <div className="text-sm text-gray-600">
                  {text[currentLanguage].connections}
                </div>
              </div>
            </div>
          </div>

          {/* Network Activity Feed */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <GitBranch className="w-5 h-5 mr-2" />
              {text[currentLanguage].recentActivity}
            </h3>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      {activity.type === 'vc_remix' && <Zap className="w-5 h-5 text-white" />}
                      {activity.type === 'vc_dm_request' && <Users className="w-5 h-5 text-white" />}
                      {activity.type === 'idea_chain' && <GitBranch className="w-5 h-5 text-white" />}
                      {activity.type === 'influence_boost' && <TrendingUp className="w-5 h-5 text-white" />}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {activity.actor}
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.action}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className="bg-purple-100 text-purple-700 mb-1">
                      +{activity.impact_score}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {getTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkEffectVisualization;
