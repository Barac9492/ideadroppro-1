
export const generateModuleTitleFromContent = (content: string, maxLength: number = 40): string => {
  if (!content || content.trim() === '') {
    return 'Untitled Module';
  }

  // Remove extra whitespace and normalize
  const cleanContent = content.trim().replace(/\s+/g, ' ');
  
  // Try to get the first sentence
  const firstSentence = cleanContent.split(/[.!?]/)[0].trim();
  
  if (firstSentence.length > 0 && firstSentence.length <= maxLength) {
    return firstSentence;
  }
  
  // If first sentence is too long, truncate and add ellipsis
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength - 3).trim() + '...';
};

export const getModuleTitle = (module: any): string => {
  // Handle different module structures
  const possibleTitles = [
    module.title,
    module.module_data?.title,
    module.module_data?.content,
    module.content
  ];

  for (const title of possibleTitles) {
    if (title && typeof title === 'string' && title.trim() !== '') {
      return generateModuleTitleFromContent(title);
    }
  }

  return 'Untitled Module';
};

export const getModuleContent = (module: any): string => {
  return module.module_data?.content || module.content || 'No content available';
};

// Improved score normalization logic
export const normalizeScore = (score: number): number => {
  // Handle invalid scores
  if (typeof score !== 'number' || isNaN(score) || score < 0) {
    console.warn('Invalid score detected:', score, 'using default 85');
    return 85;
  }

  // If score is greater than 100, assume it's already normalized but cap it
  if (score > 100) {
    console.warn('Score greater than 100 detected:', score, 'capping to 100');
    return 100;
  }

  // If score is between 1 and 100, assume it's already in percentage
  if (score > 1) {
    return Math.round(score);
  }

  // If score is between 0 and 1, convert to percentage
  if (score <= 1) {
    const normalized = Math.round(score * 100);
    console.log('Converting decimal score:', score, 'to percentage:', normalized);
    return normalized;
  }

  return Math.round(score);
};

export const getModuleScore = (module: any): number => {
  const score = module.module_data?.score || module.quality_score || 85;
  return normalizeScore(score);
};

export const getModuleType = (module: any): string => {
  return module.module_type || module.module_data?.type || 'unknown';
};
