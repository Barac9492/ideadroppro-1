
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, Users, Crown, TrendingUp, Zap, Share2 } from 'lucide-react';

interface IdeaNode {
  id: string;
  text: string;
  score: number;
  author: string;
  generation: number;
  parentId?: string;
  children: string[];
  coOwners: string[];
  vcInterest: number;
}

interface IdeaBreedingSystemProps {
  rootIdeaId: string;
  currentLanguage: 'ko' | 'en';
}

const IdeaBreedingSystem: React.FC<IdeaBreedingSystemProps> = ({
  rootIdeaId,
  currentLanguage
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showBreedingChain, setShowBreedingChain] = useState(false);

  const text = {
    ko: {
      ideaDNA: '아이디어 DNA',
      generation: '세대',
      original: '원작',
      remix: '리믹스',
      coOwnership: '공동 소유권',
      breeding: '번식 중',
      scoreEvolution: '점수 진화',
      networkValue: '네트워크 가치',
      vcAttention: 'VC 관심도',
      breedingChain: '번식 체인',
      influence: '영향력',
      descendants: '후손',
      totalReach: '총 도달'
    },
    en: {
      ideaDNA: 'Idea DNA',
      generation: 'Gen',
      original: 'Original',
      remix: 'Remix',
      coOwnership: 'Co-ownership',
      breeding: 'Breeding',
      scoreEvolution: 'Score Evolution',
      networkValue: 'Network Value',
      vcAttention: 'VC Attention',
      breedingChain: 'Breeding Chain',
      influence: 'Influence',
      descendants: 'Descendants',
      totalReach: 'Total Reach'
    }
  };

  // Mock idea breeding data
  const ideaNodes: IdeaNode[] = [
    {
      id: 'root',
      text: 'AI 기반 스마트 농업 플랫폼',
      score: 7.2,
      author: 'original_creator',
      generation: 0,
      children: ['remix1', 'remix2'],
      coOwners: [],
      vcInterest: 3
    },
    {
      id: 'remix1',
      text: 'AI 농업 + IoT 센서 통합 시스템',
      score: 8.1,
      author: 'remix_master_kim',
      generation: 1,
      parentId: 'root',
      children: ['remix3'],
      coOwners: ['original_creator'],
      vcInterest: 5
    },
    {
      id: 'remix2',
      text: 'AI 농업 B2B SaaS 모델',
      score: 7.8,
      author: 'business_guru',
      generation: 1,
      parentId: 'root',
      children: ['remix4'],
      coOwners: ['original_creator'],
      vcInterest: 4
    },
    {
      id: 'remix3',
      text: 'AI 농업 + 탄소 크레딧 거래',
      score: 8.7,
      author: 'green_innovator',
      generation: 2,
      parentId: 'remix1',
      children: [],
      coOwners: ['original_creator', 'remix_master_kim'],
      vcInterest: 8
    },
    {
      id: 'remix4',
      text: 'AI 농업 글로벌 프랜차이즈',
      score: 8.3,
      author: 'global_thinker',
      generation: 2,
      parentId: 'remix2',
      children: [],
      coOwners: ['original_creator', 'business_guru'],
      vcInterest: 6
    }
  ];

  const getGenerationColor = (generation: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800'
    ];
    return colors[generation] || 'bg-gray-100 text-gray-800';
  };

  const calculateNetworkValue = (node: IdeaNode) => {
    const baseValue = node.score * 10;
    const coOwnershipBonus = node.coOwners.length * 5;
    const vcInterestBonus = node.vcInterest * 3;
    return Math.floor(baseValue + coOwnershipBonus + vcInterestBonus);
  };

  const getTotalDescendants = (nodeId: string): number => {
    const node = ideaNodes.find(n => n.id === nodeId);
    if (!node) return 0;
    
    let count = node.children.length;
    node.children.forEach(childId => {
      count += getTotalDescendants(childId);
    });
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Breeding Overview */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-800 flex items-center">
              <GitBranch className="w-5 h-5 mr-2" />
              {text[currentLanguage].ideaDNA}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBreedingChain(!showBreedingChain)}
              className="border-purple-300 text-purple-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {text[currentLanguage].breedingChain}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {ideaNodes.length}
              </div>
              <div className="text-sm text-purple-700">총 변종</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getTotalDescendants('root')}
              </div>
              <div className="text-sm text-green-700">{text[currentLanguage].descendants}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {ideaNodes.reduce((sum, node) => sum + node.vcInterest, 0)}
              </div>
              <div className="text-sm text-blue-700">{text[currentLanguage].vcAttention}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {ideaNodes.reduce((sum, node) => sum + calculateNetworkValue(node), 0)}
              </div>
              <div className="text-sm text-orange-700">{text[currentLanguage].networkValue}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breeding Tree */}
      <div className="space-y-4">
        {ideaNodes.map((node) => (
          <Card 
            key={node.id}
            className={`${selectedNode === node.id ? 'ring-2 ring-purple-400' : ''} 
              ${node.generation === 0 ? 'border-2 border-blue-300' : 'border border-gray-200'}
              hover:shadow-lg transition-all cursor-pointer`}
            style={{ 
              marginLeft: `${node.generation * 2}rem`,
              opacity: node.generation === 0 ? 1 : 0.9 - (node.generation * 0.1)
            }}
            onClick={() => setSelectedNode(node.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getGenerationColor(node.generation)}>
                    {node.generation === 0 ? text[currentLanguage].original : 
                     `${text[currentLanguage].generation} ${node.generation}`}
                  </Badge>
                  {node.coOwners.length > 0 && (
                    <Badge className="bg-green-100 text-green-700">
                      <Users className="w-3 h-3 mr-1" />
                      {text[currentLanguage].coOwnership}
                    </Badge>
                  )}
                  {node.vcInterest > 5 && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Crown className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    {node.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    VC: {node.vcInterest}
                  </div>
                </div>
              </div>

              <p className="text-gray-800 mb-3 font-medium">
                {node.text}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    by @{node.author}
                  </span>
                  {node.coOwners.length > 0 && (
                    <span className="text-sm text-green-600">
                      +{node.coOwners.length} co-owners
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {calculateNetworkValue(node)}
                  </Badge>
                  {node.children.length > 0 && (
                    <Badge className="bg-purple-100 text-purple-700 text-xs">
                      <GitBranch className="w-3 h-3 mr-1" />
                      {node.children.length}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Breeding indicators */}
              {node.children.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-purple-700">
                      {text[currentLanguage].breeding} → {node.children.length}개 후손
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score Evolution Chart */}
      {showBreedingChain && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {text[currentLanguage].scoreEvolution}
            </h3>
            <div className="flex items-end space-x-2 h-32">
              {ideaNodes.map((node, index) => (
                <div key={node.id} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full ${getGenerationColor(node.generation).replace('text-', 'bg-').replace('100', '500')} rounded-t`}
                    style={{ height: `${(node.score / 10) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2 text-center">
                    <div className="font-medium">{node.score.toFixed(1)}</div>
                    <div className="text-gray-500">Gen {node.generation}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IdeaBreedingSystem;
