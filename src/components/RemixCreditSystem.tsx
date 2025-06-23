
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Star, Gift, ShoppingCart, Zap, Plus } from 'lucide-react';

interface RemixCreditSystemProps {
  currentLanguage: 'ko' | 'en';
  userId?: string;
}

interface ModuleItem {
  id: string;
  type: string;
  content: string;
  cost: number;
  quality: 'basic' | 'premium' | 'elite';
  author?: string;
  likes: number;
}

const RemixCreditSystem: React.FC<RemixCreditSystemProps> = ({
  currentLanguage,
  userId
}) => {
  const [credits, setCredits] = useState(12);
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [purchasedModules, setPurchasedModules] = useState<ModuleItem[]>([]);

  const text = {
    ko: {
      title: '리믹스 크레딧 시스템',
      myCredits: '보유 크레딧',
      earnCredits: '크레딧 획득 방법',
      moduleStore: '모듈 상점',
      myModules: '구매한 모듈',
      purchase: '구매하기',
      use: '사용하기',
      earnMethods: [
        '아이디어 제출: +3 크레딧',
        '커뮤니티 좋아요: +1 크레딧',
        '일일 접속: +2 크레딧',
        '친구 초대: +10 크레딧'
      ],
      moduleTypes: {
        problem: '문제 정의',
        solution: '솔루션',
        target_customer: '타겟 고객',
        revenue_model: '수익 모델',
        marketing: '마케팅 전략',
        technology: '기술 스택'
      },
      quality: {
        basic: '기본',
        premium: '프리미엄',
        elite: '엘리트'
      },
      insufficient: '크레딧이 부족합니다',
      purchased: '구매 완료!'
    },
    en: {
      title: 'Remix Credit System',
      myCredits: 'My Credits',
      earnCredits: 'How to Earn Credits',
      moduleStore: 'Module Store',
      myModules: 'Purchased Modules',
      purchase: 'Purchase',
      use: 'Use',
      earnMethods: [
        'Submit idea: +3 credits',
        'Community likes: +1 credit',
        'Daily login: +2 credits',
        'Invite friends: +10 credits'
      ],
      moduleTypes: {
        problem: 'Problem Definition',
        solution: 'Solution',
        target_customer: 'Target Customer',
        revenue_model: 'Revenue Model',
        marketing: 'Marketing Strategy',
        technology: 'Tech Stack'
      },
      quality: {
        basic: 'Basic',
        premium: 'Premium',
        elite: 'Elite'
      },
      insufficient: 'Insufficient credits',
      purchased: 'Purchased!'
    }
  };

  useEffect(() => {
    // 모듈 상점 데이터 시뮬레이션
    const mockModules: ModuleItem[] = [
      {
        id: '1',
        type: 'problem',
        content: currentLanguage === 'ko' ? '효율성 극대화를 통한 시간 절약 문제 해결' : 'Time-saving through efficiency maximization',
        cost: 2,
        quality: 'basic',
        author: 'AI System',
        likes: 23
      },
      {
        id: '2',
        type: 'solution',
        content: currentLanguage === 'ko' ? 'AI 기반 자동화 플랫폼으로 반복 작업 제거' : 'AI-powered automation platform eliminating repetitive tasks',
        cost: 4,
        quality: 'premium',
        author: 'Expert User',
        likes: 45
      },
      {
        id: '3',
        type: 'target_customer',
        content: currentLanguage === 'ko' ? '25-40세 직장인, 생산성 도구에 관심 많은 층' : 'Working professionals aged 25-40, interested in productivity tools',
        cost: 3,
        quality: 'basic',
        author: 'Market Analyst',
        likes: 31
      },
      {
        id: '4',
        type: 'revenue_model',
        content: currentLanguage === 'ko' ? 'SaaS 구독 모델 + 프리미엄 기능 별도 결제' : 'SaaS subscription model + premium feature payments',
        cost: 6,
        quality: 'elite',
        author: 'Business Expert',
        likes: 67
      }
    ];

    setAvailableModules(mockModules);
  }, [currentLanguage]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'basic': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'premium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'elite': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handlePurchase = (module: ModuleItem) => {
    if (credits >= module.cost) {
      setCredits(prev => prev - module.cost);
      setPurchasedModules(prev => [...prev, module]);
      setAvailableModules(prev => prev.filter(m => m.id !== module.id));
      
      // 성공 알림 (실제로는 toast나 다른 알림 시스템 사용)
      alert(text[currentLanguage].purchased);
    } else {
      alert(text[currentLanguage].insufficient);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 크레딧 현황 */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{text[currentLanguage].title}</h2>
              <div className="flex items-center space-x-2">
                <Coins className="w-6 h-6" />
                <span className="text-xl font-semibold">{text[currentLanguage].myCredits}: {credits}</span>
              </div>
            </div>
            <div className="bg-white/20 rounded-full p-4">
              <Star className="w-12 h-12 text-yellow-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 크레딧 획득 방법 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span>{text[currentLanguage].earnCredits}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {text[currentLanguage].earnMethods.map((method, index) => (
                <li key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <Plus className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700">{method}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 모듈 상점 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span>{text[currentLanguage].moduleStore}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {availableModules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getQualityColor(module.quality)}>
                          {text[currentLanguage].quality[module.quality]}
                        </Badge>
                        <Badge variant="outline">
                          {text[currentLanguage].moduleTypes[module.type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{module.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>by {module.author}</span>
                        <span>👍 {module.likes}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 mb-2">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-600">{module.cost}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(module)}
                        disabled={credits < module.cost}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {text[currentLanguage].purchase}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 구매한 모듈들 */}
      {purchasedModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>{text[currentLanguage].myModules}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {purchasedModules.map((module) => (
                <div key={module.id} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getQualityColor(module.quality)}>
                      {text[currentLanguage].quality[module.quality]}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {text[currentLanguage].use}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{module.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RemixCreditSystem;
