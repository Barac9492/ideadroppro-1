import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Star, Clock, Zap, Search, Plus, ArrowRight } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIdeaDeletion } from '@/hooks/useIdeaOperations/useIdeaDeletion';
import IdeaCard from './IdeaCard';

interface PersonalIdeaStorageProps {
  currentLanguage: 'ko' | 'en';
}

const PersonalIdeaStorage: React.FC<PersonalIdeaStorageProps> = ({ currentLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const { ideas, isLoading, fetchIdeas, toggleLike, generateAnalysis } = useIdeas(currentLanguage);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { deleteIdea } = useIdeaDeletion({ currentLanguage, user, fetchIdeas });

  const text = {
    ko: {
      title: '내 아이디어 보관소',
      subtitle: '지속적으로 발전시킬 수 있는 나만의 아이디어 공간',
      search: '아이디어 검색...',
      all: '전체',
      favorites: '즐겨찾기',
      needsWork: '개선 필요',
      completed: '완성됨',
      noIdeas: '아직 아이디어가 없습니다',
      createFirst: '첫 번째 아이디어를 만들어보세요!',
      createIdea: '아이디어 만들기',
      improve: '개선하기',
      favorite: '즐겨찾기',
      decompose: '모듈로 분해하기',
      stats: {
        total: '총 아이디어',
        avgScore: '평균 점수',
        needsImprovement: '개선 가능',
        favorites: '즐겨찾기'
      }
    },
    en: {
      title: 'My Idea Storage',
      subtitle: 'Your personal space for continuously developing ideas',
      search: 'Search ideas...',
      all: 'All',
      favorites: 'Favorites',
      needsWork: 'Needs Work',
      completed: 'Completed',
      noIdeas: 'No ideas yet',
      createFirst: 'Create your first idea!',
      createIdea: 'Create Idea',
      improve: 'Improve',
      favorite: 'Favorite',
      decompose: 'Decompose to Modules',
      stats: {
        total: 'Total Ideas',
        avgScore: 'Avg Score',
        needsImprovement: 'Needs Work',
        favorites: 'Favorites'
      }
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Filter ideas to show only user's ideas
  const myIdeas = ideas.filter(idea => idea.user_id === user?.id);

  // Filter ideas based on search and tab
  const filteredIdeas = myIdeas.filter(idea => {
    const matchesSearch = idea.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (selectedTab) {
      case 'favorites':
        return matchesSearch && idea.hasLiked;
      case 'needsWork':
        return matchesSearch && idea.score < 7;
      case 'completed':
        return matchesSearch && idea.score >= 8;
      default:
        return matchesSearch;
    }
  });

  // Calculate stats
  const stats = {
    total: myIdeas.length,
    avgScore: myIdeas.length > 0 ? (myIdeas.reduce((sum, idea) => sum + idea.score, 0) / myIdeas.length).toFixed(1) : '0',
    needsImprovement: myIdeas.filter(idea => idea.score < 7).length,
    favorites: myIdeas.filter(idea => idea.hasLiked).length
  };

  const handleImprove = (ideaId: string) => {
    navigate(`/builder?improve=${ideaId}`);
  };

  const handleDecompose = (ideaId: string) => {
    navigate(`/builder?decompose=${ideaId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.avgScore}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].stats.avgScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.needsImprovement}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].stats.needsImprovement}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.favorites}</div>
            <div className="text-sm text-gray-500">{text[currentLanguage].stats.favorites}</div>
          </CardContent>
        </Card>
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
        <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          {text[currentLanguage].createIdea}
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{text[currentLanguage].all}</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{text[currentLanguage].favorites}</span>
          </TabsTrigger>
          <TabsTrigger value="needsWork" className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{text[currentLanguage].needsWork}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{text[currentLanguage].completed}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {filteredIdeas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {text[currentLanguage].noIdeas}
                </h3>
                <p className="text-gray-500 mb-6">
                  {text[currentLanguage].createFirst}
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {text[currentLanguage].createIdea}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="relative">
                  <IdeaCard
                    idea={idea}
                    currentLanguage={currentLanguage}
                    currentUserId={user?.id}
                    onLike={toggleLike}
                    onGenerateAnalysis={generateAnalysis}
                    onGenerateGlobalAnalysis={() => {}}
                    onSaveFinalVerdict={() => {}}
                    onDelete={deleteIdea}
                    isAuthenticated={true}
                  />
                  
                  {/* Action Button Overlays */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Decompose to Modules Button */}
                    <Button
                      onClick={() => handleDecompose(idea.id)}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-purple-50 border-purple-200 text-purple-600"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {text[currentLanguage].decompose}
                    </Button>
                    
                    {/* Improvement Button */}
                    {idea.score < 8 && (
                      <Button
                        onClick={() => handleImprove(idea.id)}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        {text[currentLanguage].improve}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalIdeaStorage;
