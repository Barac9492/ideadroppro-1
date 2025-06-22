
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, Users, Tag, Plus } from 'lucide-react';
import { useModularIdeas, IdeaModule } from '@/hooks/useModularIdeas';

interface ModuleBrowserProps {
  currentLanguage: 'ko' | 'en';
  onModuleSelect?: (module: IdeaModule) => void;
  selectedModules?: IdeaModule[];
}

const ModuleBrowser: React.FC<ModuleBrowserProps> = ({
  currentLanguage,
  onModuleSelect,
  selectedModules = []
}) => {
  const { modules, templates, loading, fetchModules } = useModularIdeas({ currentLanguage });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'quality' | 'usage' | 'recent'>('quality');

  const text = {
    ko: {
      title: '모듈 브라우저',
      search: '모듈 검색...',
      allTypes: '모든 타입',
      sortBy: '정렬',
      quality: '품질순',
      usage: '사용빈도순',
      recent: '최근순',
      select: '선택',
      selected: '선택됨',
      usageCount: '사용 횟수',
      qualityScore: '품질 점수',
      noModules: '모듈이 없습니다',
      loadMore: '더 보기',
      moduleTypes: {
        problem: '문제점',
        solution: '솔루션',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        key_activities: '핵심 활동',
        key_resources: '핵심 자원',
        channels: '유통 채널',
        competitive_advantage: '경쟁 우위',
        market_size: '시장 규모',
        team: '팀',
        potential_risks: '잠재 리스크'
      }
    },
    en: {
      title: 'Module Browser',
      search: 'Search modules...',
      allTypes: 'All Types',
      sortBy: 'Sort by',
      quality: 'Quality',
      usage: 'Usage',
      recent: 'Recent',
      select: 'Select',
      selected: 'Selected',
      usageCount: 'Usage Count',
      qualityScore: 'Quality Score',
      noModules: 'No modules found',
      loadMore: 'Load More',
      moduleTypes: {
        problem: 'Problem',
        solution: 'Solution',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        key_activities: 'Key Activities',
        key_resources: 'Key Resources',
        channels: 'Channels',
        competitive_advantage: 'Competitive Advantage',
        market_size: 'Market Size',
        team: 'Team',
        potential_risks: 'Potential Risks'
      }
    }
  };

  const moduleTypes = Object.keys(text[currentLanguage].moduleTypes);

  // Filter and sort modules
  const filteredModules = modules
    .filter(module => {
      const matchesSearch = module.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || module.module_type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'quality':
          return (b.quality_score || 0) - (a.quality_score || 0);
        case 'usage':
          return (b.usage_count || 0) - (a.usage_count || 0);
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const isModuleSelected = (module: IdeaModule) => {
    return selectedModules.some(selected => selected.id === module.id);
  };

  const handleModuleSelect = (module: IdeaModule) => {
    if (onModuleSelect) {
      onModuleSelect(module);
    }
  };

  const renderModuleCard = (module: IdeaModule) => (
    <Card key={module.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2">
              {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']] || module.module_type}
            </Badge>
            <CardTitle className="text-sm font-medium line-clamp-2">
              {module.content}
            </CardTitle>
          </div>
          <Button
            variant={isModuleSelected(module) ? "default" : "outline"}
            size="sm"
            onClick={() => handleModuleSelect(module)}
            disabled={isModuleSelected(module)}
          >
            {isModuleSelected(module) ? text[currentLanguage].selected : text[currentLanguage].select}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5" />
              <span>{(module.quality_score || 0).toFixed(1)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>{module.usage_count || 0}</span>
            </span>
          </div>
          <span>{new Date(module.created_at).toLocaleDateString()}</span>
        </div>
        
        {module.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {module.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {module.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{module.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{text[currentLanguage].title}</h2>
        <Button onClick={() => fetchModules()} variant="outline" size="sm">
          <Search className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={text[currentLanguage].search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={text[currentLanguage].allTypes} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{text[currentLanguage].allTypes}</SelectItem>
            {moduleTypes.map(type => (
              <SelectItem key={type} value={type}>
                {text[currentLanguage].moduleTypes[type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quality">{text[currentLanguage].quality}</SelectItem>
            <SelectItem value="usage">{text[currentLanguage].usage}</SelectItem>
            <SelectItem value="recent">{text[currentLanguage].recent}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Module Tabs by Type */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          {moduleTypes.slice(0, 5).map(type => (
            <TabsTrigger key={type} value={type} className="text-xs">
              {text[currentLanguage].moduleTypes[type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map(renderModuleCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">{text[currentLanguage].noModules}</p>
            </div>
          )}
        </TabsContent>

        {moduleTypes.map(type => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules
                .filter(module => module.module_type === type)
                .map(renderModuleCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ModuleBrowser;
