
/**
 * Extracts search information from various possible locations in the results object
 */
export const getSearchInfo = (results: any) => {
  if (results?.search_info) {
    return results.search_info;
  }
  
  // Try to extract from the results object directly if needed
  return {
    keywords: results?.keywords || '',
    location: results?.location || '',
    fields: results?.fields || [],
    data: results?.data || []
  };
};

/**
 * Ensures that a value is converted to an array
 */
export const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Handle comma-separated string
    return value.split(',').map(item => item.trim());
  }
  if (value === null || value === undefined) return [];
  return [String(value)]; // Convert single value to array
};
