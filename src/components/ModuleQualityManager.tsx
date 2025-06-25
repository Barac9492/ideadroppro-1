
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Star, Globe, Lock, Tag } from 'lucide-react';
import { IdeaModule } from '@/hooks/useModularIdeas';

interface ModuleQualityManagerProps {
  modules: IdeaModule[];
  currentLanguage: 'ko' | 'en';
  onSave: (modules: IdeaModule[], isPublic: boolean, tags: string[]) => void;
  onCancel: () => void;
}

const ModuleQualityManager: React.FC<ModuleQualityManagerProps> = ({
  modules,
  currentLanguage,
  onSave,
  onCancel
}) => {
  const [isPublic, setIsPublic] = useState(false);
  const [customTags, setCustomTags] = useState('');
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)));

  const text = {
    ko: {
      title: '모듈 품질 설정',
      subtitle: '생성된 모듈의 품질을 설정하고 공개 여부를 결정하세요',
      makePublic: '공개 모듈로 설정',
      publicDesc: '다른 사용자들이 사용할 수 있도록 공개합니다',
      privateDesc: '나만 사용할 수 있는 개인 모듈입니다',
      addTags: '태그 추가 (쉼표로 구분)',
      tagsPlaceholder: '예: 스타트업, AI, 교육, 헬스케어',
      save: '저장하기',
      cancel: '취소',
      qualityTip: '공개 모듈은 다른 사용자들의 피드백을 받아 품질 점수가 향상됩니다'
    },
    en: {
      title: 'Module Quality Settings',
      subtitle: 'Set quality and visibility for generated modules',
      makePublic: 'Make Public',
      publicDesc: 'Share with other users for community use',
      privateDesc: 'Keep private for personal use only',
      addTags: 'Add Tags (comma separated)',
      tagsPlaceholder: 'e.g: startup, AI, education, healthcare',
      save: 'Save',
      cancel: 'Cancel',
      qualityTip: 'Public modules receive feedback and improve in quality score'
    }
  };

  const handleSave = () => {
    const tags = customTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const selectedModulesList = modules.filter(m => selectedModules.has(m.id));
    onSave(selectedModulesList, isPublic, tags);
  };

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Public/Private Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            {isPublic ? (
              <Globe className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-600" />
            )}
            <div>
              <p className="font-medium">{text[currentLanguage].makePublic}</p>
              <p className="text-sm text-gray-600">
                {isPublic ? text[currentLanguage].publicDesc : text[currentLanguage].privateDesc}
              </p>
            </div>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        {/* Quality Tip */}
        {isPublic && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 {text[currentLanguage].qualityTip}
            </p>
          </div>
        )}

        {/* Tags Input */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Tag className="w-4 h-4" />
            <span>{text[currentLanguage].addTags}</span>
          </label>
          <Textarea
            value={customTags}
            onChange={(e) => setCustomTags(e.target.value)}
            placeholder={text[currentLanguage].tagsPlaceholder}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Module Selection */}
        <div className="space-y-4">
          <h3 className="font-medium">선택된 모듈 ({selectedModules.size}/{modules.length})</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedModules.has(module.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleModuleSelection(module.id)}
              >
                <Badge variant="secondary" className="mb-2">
                  {module.module_type}
                </Badge>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {module.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            {text[currentLanguage].cancel}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={selectedModules.size === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {text[currentLanguage].save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleQualityManager;
