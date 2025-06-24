
import React from 'react';

export interface IdeaQuality {
  score: number; // 0-100
  level: 'basic' | 'intermediate' | 'advanced';
  issues: string[];
  suggestions: string[];
  needsExpansion: boolean;
}

export const analyzeIdeaQuality = (idea: string, language: 'ko' | 'en'): IdeaQuality => {
  const ideaLength = idea.trim().length;
  const words = idea.trim().split(/\s+/).length;
  
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Length scoring
  if (ideaLength < 20) {
    score += 10;
    issues.push(language === 'ko' ? '아이디어가 너무 짧습니다' : 'Idea is too short');
    suggestions.push(language === 'ko' ? '더 구체적으로 설명해보세요' : 'Please describe more specifically');
  } else if (ideaLength < 50) {
    score += 30;
  } else {
    score += 50;
  }
  
  // Word count scoring
  if (words < 5) {
    issues.push(language === 'ko' ? '키워드만으로는 부족합니다' : 'Keywords alone are insufficient');
    suggestions.push(language === 'ko' ? '문장으로 설명해주세요' : 'Please explain in sentences');
  } else {
    score += 20;
  }
  
  // Specificity check
  const vaguePhrases = language === 'ko' 
    ? ['앱', '서비스', '플랫폼', '시스템', '좋은', '편리한', '쉬운']
    : ['app', 'service', 'platform', 'system', 'good', 'convenient', 'easy'];
  
  const specificTerms = language === 'ko'
    ? ['문제', '해결', '타겟', '고객', '수익', '경쟁', '차별', '시장']
    : ['problem', 'solve', 'target', 'customer', 'revenue', 'compete', 'differentiate', 'market'];
  
  const hasVagueTerms = vaguePhrases.some(phrase => idea.toLowerCase().includes(phrase));
  const hasSpecificTerms = specificTerms.some(term => idea.toLowerCase().includes(term));
  
  if (hasVagueTerms && !hasSpecificTerms) {
    issues.push(language === 'ko' ? '너무 일반적인 표현입니다' : 'Too generic expression');
    suggestions.push(language === 'ko' ? '구체적인 문제나 상황을 언급해보세요' : 'Mention specific problems or situations');
  } else if (hasSpecificTerms) {
    score += 30;
  }
  
  // Determine level and expansion need
  let level: 'basic' | 'intermediate' | 'advanced' = 'basic';
  let needsExpansion = true;
  
  if (score >= 70) {
    level = 'advanced';
    needsExpansion = false;
  } else if (score >= 40) {
    level = 'intermediate';
    needsExpansion = score < 60;
  } else {
    level = 'basic';
    needsExpansion = true;
  }
  
  return {
    score,
    level,
    issues,
    suggestions,
    needsExpansion
  };
};
