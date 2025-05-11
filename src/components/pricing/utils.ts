
// Helper function to safely transform features from the database
export function getFeaturesList(features: any): string[] {
  if (!features) return [];
  
  // If features is already an array, return it
  if (Array.isArray(features)) return features;
  
  // If features is an object, transform it to an array of strings
  if (typeof features === 'object') {
    const featuresList = [];
    
    // Add row limit feature if available
    if (features.unlimited_rows) {
      featuresList.push("Unlimited business listings");
    }
    
    // Add analytics feature if available
    if (features.analytics) {
      featuresList.push("Advanced analytics dashboard");
    }
    
    // Add API access feature if available
    if (features.api_access) {
      featuresList.push("API access");
    }
    
    // Add reviews data feature if available
    if (features.reviews_data) {
      featuresList.push("Customer reviews data");
    }
    
    // Add default features that all plans have
    featuresList.push(
      "Export to CSV and Excel",
      "Email support"
    );
    
    return featuresList;
  }
  
  return [];
}
