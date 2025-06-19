
// Content filtering utility for inappropriate content
export const inappropriateKeywords = {
  ko: [
    // 폭력적 키워드
    '살인', '죽이', '폭력', '때리', '구타', '폭행', '테러', '폭탄', '무기', '칼', '총',
    '자살', '죽음', '죽어', '죽고', '해치', '상해', '고문', '학대', '괴롭',
    // 성적 키워드
    '섹스', '성관계', '성교', '음란', '야동', '포르노', '성인', '19금', '성기',
    '가슴', '엉덩이', '성희롱', '성폭력', '강간', '몰카', '도촬', '성매매',
    // 차별/혐오 키워드
    '멸시', '혐오', '차별', '비하', '욕설', '저주', '증오', '배척'
  ],
  en: [
    // Violence keywords
    'kill', 'murder', 'violence', 'beat', 'assault', 'attack', 'terror', 'bomb', 'weapon', 'knife', 'gun',
    'suicide', 'death', 'die', 'dying', 'harm', 'hurt', 'torture', 'abuse', 'bully',
    // Sexual keywords
    'sex', 'sexual', 'porn', 'nude', 'naked', 'breast', 'penis', 'vagina', 'rape',
    'harassment', 'molest', 'adult', 'xxx', 'erotic', 'prostitution',
    // Discrimination/hate keywords
    'hate', 'discrimination', 'racist', 'sexist', 'bigot', 'slur', 'offensive'
  ]
};

export const checkInappropriateContent = (text: string, language: 'ko' | 'en'): boolean => {
  const lowerText = text.toLowerCase();
  const keywords = inappropriateKeywords[language];
  
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

export const getContentWarning = (language: 'ko' | 'en') => {
  return {
    ko: {
      title: '부적절한 콘텐츠 감지',
      message: '폭력적이거나 성적인 내용, 또는 혐오 표현이 포함된 아이디어는 제출할 수 없습니다. 건전하고 창의적인 아이디어를 공유해주세요.',
      guidelines: '커뮤니티 가이드라인을 준수해주세요.'
    },
    en: {
      title: 'Inappropriate Content Detected',
      message: 'Ideas containing violent, sexual, or hateful content cannot be submitted. Please share constructive and creative ideas.',
      guidelines: 'Please follow our community guidelines.'
    }
  };
};
