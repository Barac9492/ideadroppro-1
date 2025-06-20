
// Content filtering utility for inappropriate content and text quality
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

// Text quality patterns to detect meaningless input
const meaninglessPatterns = {
  ko: [
    // 한글 자음/모음 연타
    /^[ㄱ-ㅎㅏ-ㅣ\s]{3,}$/,
    // 같은 글자 반복 (3개 이상)
    /(.)\1{2,}/,
    // 순서대로 입력한 키보드 패턴
    /[ㅁㄴㅇㄹ]{3,}|[ㅂㅈㄷㄱ]{3,}|[ㅛㅕㅑㅐ]{3,}/,
    // 의미없는 반복
    /^(ㅋ|ㅎ|ㅠ){5,}$/
  ],
  en: [
    // Keyboard rows
    /[qwertyuiop]{4,}|[asdfghjkl]{4,}|[zxcvbnm]{4,}/i,
    // Same character repetition
    /(.)\1{3,}/,
    // Random letter combinations
    /^[a-z]{1,3}$/i,
    // Only punctuation or numbers
    /^[0-9\s\-_.!@#$%^&*()]{1,10}$/
  ]
};

export const checkTextQuality = (text: string, language: 'ko' | 'en'): { isValid: boolean; reason?: string } => {
  const trimmedText = text.trim();
  
  // Check minimum length
  if (trimmedText.length < 10) {
    return {
      isValid: false,
      reason: language === 'ko' ? 
        '아이디어는 최소 10자 이상 작성해주세요.' : 
        'Please write at least 10 characters for your idea.'
    };
  }

  // Check for meaningless patterns
  const patterns = meaninglessPatterns[language];
  for (const pattern of patterns) {
    if (pattern.test(trimmedText)) {
      return {
        isValid: false,
        reason: language === 'ko' ? 
          '의미 있는 아이디어를 작성해주세요. 키보드 연타나 무의미한 문자는 제출할 수 없습니다.' : 
          'Please write a meaningful idea. Random keystrokes or meaningless characters cannot be submitted.'
      };
    }
  }

  // Check for meaningful words (Korean: at least 2 words, English: at least 3 words)
  const words = trimmedText.split(/\s+/).filter(word => word.length > 1);
  const minWords = language === 'ko' ? 2 : 3;
  
  if (words.length < minWords) {
    return {
      isValid: false,
      reason: language === 'ko' ? 
        '더 구체적이고 상세한 아이디어를 작성해주세요.' : 
        'Please write a more detailed and specific idea.'
    };
  }

  // Check for only special characters or numbers
  if (/^[^가-힣a-zA-Z]*$/.test(trimmedText.replace(/\s/g, ''))) {
    return {
      isValid: false,
      reason: language === 'ko' ? 
        '문자로 구성된 의미 있는 아이디어를 작성해주세요.' : 
        'Please write a meaningful idea using letters.'
    };
  }

  return { isValid: true };
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

export const getQualityWarning = (language: 'ko' | 'en') => {
  return {
    ko: {
      title: '텍스트 품질 검사',
      suggestions: [
        '구체적인 문제나 니즈를 설명해주세요',
        '해결책이나 아이디어의 핵심을 포함해주세요',
        '최소 10자 이상 작성해주세요',
        '의미 있는 단어들로 구성해주세요'
      ]
    },
    en: {
      title: 'Text Quality Check',
      suggestions: [
        'Describe a specific problem or need',
        'Include the core of your solution or idea',
        'Write at least 10 characters',
        'Use meaningful words'
      ]
    }
  };
};
