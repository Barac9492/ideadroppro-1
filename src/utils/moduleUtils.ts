
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
  // Try different sources for title
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

export const getModuleScore = (module: any): number => {
  return module.module_data?.score || module.quality_score || 85;
};
