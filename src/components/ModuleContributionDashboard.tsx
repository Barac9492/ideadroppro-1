
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Share, Lock, Unlock, Gift, Star, Users, Zap } from 'lucide-react';
import { useModularIdeas } from '@/hooks/useModularIdeas';
import ModuleBrowser from './ModuleBrowser';

interface ModuleContributionDashboardProps {
  currentLanguage: 'ko' | 'en';
}

const ModuleContributionDashboard: React.FC<ModuleContributionDashboardProps> = ({ currentLanguage }) => {
  const [shareEnabled, setShareEnabled] = useState(true);
  const { modules, loading } = useModularIdeas({ currentLanguage });

  const text = {
    ko: {
      title: '모듈 공유 & 활용',
      subtitle: '내 모듈을 공유하고 다른 사람의 모듈을 활용해보세요',
      shareSettings: '공유 설정',
      shareEnabled: '내 모듈 공유 허용',
      shareDisabled: '내 모듈 비공개',
      contributionLevel: '기여 레벨',
      availableModules: '사용 가능한 모듈',
      myContributions: '내 기여 모듈',
      usageRights: '활용 권한',
      nextLevel: '다음 레벨까지',
      examples: {
        title: '성공 사례 예시',
        case1: {
          title: '배달 앱 → 물류 플랫폼',
          description: '"타겟 고객", "핵심 기능" 모듈을 재활용하여 더 큰 비즈니스로 확장',
          modules: ['B2C 고객', '실시간 추적', '결제 시스템']
        },
        case2: {
          title: '개인 과외 → 에듀테크',
          description: '"교육 방식", "수익 모델" 모듈을 조합하여 스케일업',
          modules: ['1:1 맞춤', '구독 모델', '성과 측정']
        }
      },
      levels: {
        bronze: '브론즈 (0-4개 공유)',
        silver: '실버 (5-9개 공유)', 
        gold: '골드 (10-19개 공유)',
        platinum: '플래티넘 (20개+ 공유)'
      }
    },
    en: {
      title: 'Module Sharing & Usage',
      subtitle: 'Share your modules and utilize others\' modules',
      shareSettings: 'Sharing Settings',
      shareEnabled: 'Allow sharing my modules',
      shareDisabled: 'Keep my modules private',
      contributionLevel: 'Contribution Level',
      availableModules: 'Available Modules',
      myContributions: 'My Contributions',
      usageRights: 'Usage Rights',
      nextLevel: 'To next level',
      examples: {
        title: 'Success Case Examples',
        case1: {
          title: 'Delivery App → Logistics Platform',
          description: 'Reused "Target Customer", "Core Features" modules to expand to bigger business',
          modules: ['B2C Customer', 'Real-time Tracking', 'Payment System']
        },
        case2: {
          title: 'Personal Tutoring → EdTech',
          description: 'Combined "Teaching Method", "Revenue Model" modules for scale-up',
          modules: ['1:1 Customized', 'Subscription Model', 'Performance Tracking']
        }
      },
      levels: {
        bronze: 'Bronze (0-4 shared)',
        silver: 'Silver (5-9 shared)', 
        gold: 'Gold (10-19 shared)',
        platinum: 'Platinum (20+ shared)'
      }
    }
  };

  // Mock data for demonstration
  const myModulesCount = 7;
  const usageAllowance = Math.min(myModulesCount * 2, 50);
  const currentLevel = myModulesCount < 5 ? 'bronze' : myModulesCount < 10 ? 'silver' : myModulesCount < 20 ? 'gold' : 'platinum';
  const nextLevelProgress = myModulesCount < 5 ? (myModulesCount / 5) * 100 : myModulesCount < 10 ? ((myModulesCount - 5) / 5) * 100 : myModulesCount < 20 ? ((myModulesCount - 10) / 10) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Share className="w-5 h-5 mr-2 text-blue-500" />
              {text[currentLanguage].myContributions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">{myModulesCount}</div>
            <Badge variant="secondary" className="text-xs">
              {text[currentLanguage].levels[currentLevel as keyof typeof text[typeof currentLanguage]['levels']]}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Gift className="w-5 h-5 mr-2 text-green-500" />
              {text[currentLanguage].usageRights}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">{usageAllowance}</div>
            <div className="text-sm text-gray-500">
              {text[currentLanguage].availableModules}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              {text[currentLanguage].nextLevel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={nextLevelProgress} className="mb-2" />
            <div className="text-sm text-gray-500">
              {currentLevel === 'platinum' ? '최고 레벨!' : `${Math.ceil((5 - (myModulesCount % 5)) % 5)}개 더 필요`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sharing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              {shareEnabled ? <Unlock className="w-5 h-5 mr-2 text-green-500" /> : <Lock className="w-5 h-5 mr-2 text-red-500" />}
              {text[currentLanguage].shareSettings}
            </span>
            <Switch
              checked={shareEnabled}
              onCheckedChange={setShareEnabled}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {shareEnabled ? text[currentLanguage].shareEnabled : text[currentLanguage].shareDisabled}
          </p>
          {shareEnabled && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <Gift className="w-4 h-4 mr-2" />
                <span className="font-medium">공유하면 2배 활용 권한을 받을 수 있어요!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            {text[currentLanguage].examples.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">
                {text[currentLanguage].examples.case1.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {text[currentLanguage].examples.case1.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {text[currentLanguage].examples.case1.modules.map((module, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">
                {text[currentLanguage].examples.case2.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {text[currentLanguage].examples.case2.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {text[currentLanguage].examples.case2.modules.map((module, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Browser */}
      <ModuleBrowser 
        currentLanguage={currentLanguage}
        onModuleSelect={(module) => console.log('Selected module:', module)}
      />
    </div>
  );
};

export default ModuleContributionDashboard;
