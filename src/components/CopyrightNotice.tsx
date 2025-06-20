
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CopyrightNoticeProps {
  currentLanguage: 'ko' | 'en';
  variant?: 'default' | 'compact';
}

const CopyrightNotice: React.FC<CopyrightNoticeProps> = ({ 
  currentLanguage, 
  variant = 'default' 
}) => {
  const text = {
    ko: {
      title: '저작권 및 지적재산권 안내',
      description: '아이디어 제출 시 유의사항',
      points: [
        '제출하신 아이디어의 저작권은 제출자에게 있습니다',
        '타인의 저작권, 특허권, 상표권을 침해하지 않도록 주의해주세요',
        '기존 제품이나 서비스와 유사한 아이디어일 수 있으니 사전 검토를 권장합니다',
        '중요한 아이디어는 별도의 지적재산권 보호 조치를 고려해보세요'
      ],
      compactText: '제출된 아이디어의 저작권은 제출자에게 있으며, 타인의 지적재산권 침해에 주의해주세요.'
    },
    en: {
      title: 'Copyright & Intellectual Property Notice',
      description: 'Important guidelines for idea submission',
      points: [
        'Copyright of submitted ideas belongs to the submitter',
        'Please ensure your ideas do not infringe on others\' copyright, patents, or trademarks',
        'Similar ideas to existing products/services may exist - prior research is recommended',
        'Consider additional IP protection measures for valuable ideas'
      ],
      compactText: 'Copyright of submitted ideas belongs to you. Please ensure no infringement of others\' intellectual property.'
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
        <div className="flex items-start space-x-2">
          <Shield className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-amber-800 leading-relaxed">
            {text[currentLanguage].compactText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <Shield className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              {text[currentLanguage].title}
            </h4>
            <p className="text-amber-700 text-sm">
              {text[currentLanguage].description}
            </p>
          </div>
          <ul className="space-y-1 text-sm text-amber-700">
            {text[currentLanguage].points.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-amber-600 font-bold text-xs mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CopyrightNotice;
