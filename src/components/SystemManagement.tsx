
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Zap } from 'lucide-react';
import BulkAnalysisButton from './BulkAnalysisButton';
import { useIdeas } from '@/hooks/useIdeas';

interface SystemManagementProps {
  currentLanguage: 'ko' | 'en';
}

const SystemManagement: React.FC<SystemManagementProps> = ({ currentLanguage }) => {
  const { fetchIdeas } = useIdeas(currentLanguage);

  const text = {
    ko: {
      title: '시스템 관리',
      description: '시스템 전반의 관리 도구와 분석 기능을 제공합니다.',
      analysisTools: '분석 도구',
      analysisDescription: '아이디어 분석 및 점수 관리 도구'
    },
    en: {
      title: 'System Management',
      description: 'Provides system-wide management tools and analysis features.',
      analysisTools: 'Analysis Tools',
      analysisDescription: 'Idea analysis and score management tools'
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {text[currentLanguage].description}
          </p>

          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>{text[currentLanguage].analysisTools}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {text[currentLanguage].analysisDescription}
                </p>
                <BulkAnalysisButton 
                  currentLanguage={currentLanguage}
                  fetchIdeas={fetchIdeas}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagement;
