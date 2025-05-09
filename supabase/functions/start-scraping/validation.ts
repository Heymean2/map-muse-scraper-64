
// Function to validate scraping request parameters
export function validateScrapingParams(params: any): { isValid: boolean; error?: string } {
  if (!params.keywords) {
    return { isValid: false, error: "Keywords are required" };
  }

  if (!params.country) {
    return { isValid: false, error: "Country is required" };
  }

  if (!params.states || !Array.isArray(params.states) || params.states.length === 0) {
    return { isValid: false, error: "At least one state is required" };
  }

  if (!params.fields || !Array.isArray(params.fields) || params.fields.length === 0) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}
