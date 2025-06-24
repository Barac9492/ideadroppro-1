
import React from 'react';

export interface IdeaQuality {
  score: number; // 0-100
  level: 'basic' | 'intermediate' | 'advanced';
  issues: string[];
  suggestions: string[];
  needsExpansion: boolean;
  hasMinimumContent: boolean;
  specificityScore: number;
}

export const analyzeIdeaQuality = (idea: string, language: 'ko' | 'en'): IdeaQuality => {
  const ideaLength = idea.trim().length;
  const words = idea.trim().split(/\s+/).length;
  const sentences = idea.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  let score = 0;
  let specificityScore = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // 더 엄격한 길이 검증
  if (ideaLength < 30) {
    score += 5;
    issues.push(language === 'ko' ? '아이디어가 너무 짧습니다 (최소 30자 필요)' : 'Idea is too short (minimum 30 characters required)');
    suggestions.push(language === 'ko' ? '구체적인 문제상황, 대상, 해결방법을 포함해서 설명해주세요' : 'Please include specific problem situation, target audience, and solution method');
  } else if (ideaLength < 80) {
    score += 20;
    issues.push(language === 'ko' ? '아이디어에 더 많은 세부사항이 필요합니다' : 'More details needed for your idea');
    suggestions.push(language === 'ko' ? '왜 이 아이디어가 필요한지, 누구를 위한 것인지 추가해주세요' : 'Add why this idea is needed and who it\'s for');
  } else if (ideaLength < 150) {
    score += 40;
  } else {
    score += 60;
  }
  
  // 문장 구조 분석
  if (sentences < 2) {
    issues.push(language === 'ko' ? '최소 2개 이상의 완전한 문장으로 설명해주세요' : 'Please use at least 2 complete sentences');
    suggestions.push(language === 'ko' ? '문제 설명과 해결방안을 각각 다른 문장으로 나누어 주세요' : 'Separate problem description and solution into different sentences');
  } else {
    score += 15;
  }
  
  // 키워드 분석 - 더 엄격한 기준
  const vaguePhrases = language === 'ko' 
    ? ['앱', '서비스', '플랫폼', '시스템', '좋은', '편리한', '쉬운', '간단한', '빠른']
    : ['app', 'service', 'platform', 'system', 'good', 'convenient', 'easy', 'simple', 'fast'];
  
  const specificTerms = language === 'ko'
    ? ['문제', '해결', '타겟', '고객', '사용자', '수익', '경쟁', '차별', '시장', '비용', '효율', '시간절약']
    : ['problem', 'solve', 'target', 'customer', 'user', 'revenue', 'compete', 'differentiate', 'market', 'cost', 'efficiency', 'time-saving'];

  const businessTerms = language === 'ko'
    ? ['매출', '이익', '고객층', '시장점유율', '경쟁우위', '가치제안', '비즈니스모델']
    : ['revenue', 'profit', 'customer base', 'market share', 'competitive advantage', 'value proposition', 'business model'];

  const vaguePhraseCount = vaguePhrases.filter(phrase => idea.toLowerCase().includes(phrase)).length;
  const specificTermCount = specificTerms.filter(term => idea.toLowerCase().includes(term)).length;
  const businessTermCount = businessTerms.filter(term => idea.toLowerCase().includes(term)).length;

  // 구체성 점수 계산
  specificityScore = (specificTermCount * 15) + (businessTermCount * 25) - (vaguePhraseCount * 10);
  specificityScore = Math.max(0, Math.min(100, specificityScore));

  if (vaguePhraseCount > specificTermCount) {
    issues.push(language === 'ko' ? '너무 일반적이고 추상적인 표현이 많습니다' : 'Too many generic and abstract expressions');
    suggestions.push(language === 'ko' ? '구체적인 문제상황, 타겟 고객, 해결방법을 명시해주세요' : 'Specify concrete problem situations, target customers, and solutions');
  } else if (specificTermCount > 0) {
    score += 25;
  }

  // 비즈니스 관점 검증
  if (businessTermCount === 0) {
    issues.push(language === 'ko' ? '비즈니스 관점의 설명이 부족합니다' : 'Lacks business perspective');
    suggestions.push(language === 'ko' ? '수익모델, 타겟고객, 시장기회 등을 언급해보세요' : 'Mention revenue model, target customers, market opportunities');
  } else {
    score += 15;
  }

  // 최종 점수 조정
  score = Math.min(100, score + (specificityScore * 0.2));
  
  // 레벨 및 확장 필요성 결정 - 더 엄격한 기준
  let level: 'basic' | 'intermediate' | 'advanced' = 'basic';
  let needsExpansion = true;
  let hasMinimumContent = false;

  if (score >= 80 && specificityScore >= 60) {
    level = 'advanced';
    needsExpansion = false;
    hasMinimumContent = true;
  } else if (score >= 60 && specificityScore >= 40) {
    level = 'intermediate';
    needsExpansion = score < 70;
    hasMinimumContent = true;
  } else {
    level = 'basic';
    needsExpansion = true;
    hasMinimumContent = score >= 40 && ideaLength >= 50;
  }

  // 최소 기준 미달 시 강제 피드백
  if (!hasMinimumContent) {
    issues.unshift(language === 'ko' ? '⚠️ 아이디어가 최소 기준에 미달합니다' : '⚠️ Idea does not meet minimum standards');
    suggestions.unshift(language === 'ko' ? '다음 단계로 진행하기 전에 반드시 아이디어를 확장해주세요' : 'Please Expand your idea before proceeding to the next step');
  }
  
  return {
    score: Math.round(score),
    level,
    issues,
    suggestions,
    needsExpansion,
    hasMinimumContent,
    specificityScore: Math.round(specificityScore)
  };
};
