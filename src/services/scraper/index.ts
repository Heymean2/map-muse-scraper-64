
// Main entry point for the scraper service
// Re-export all functions from the different files

// Types
export type {
  ScraperParams,
  ScraperResponse,
  ScrapingRequest,
  UserPlanInfo,
  FreeTierLimitInfo
} from './types';

// Config
export { BASE_URL } from './config';

// Task-related functions
export { 
  startScraping,
  getScrapingResults,
  getUserScrapingTasks,
  getUserPlanInfo
} from './tasks';

// Eligibility and plan related functions
export {
  checkScrapingEligibility
} from './eligibility';

// File handling functions
export {
  downloadCsvFromUrl
} from './files';

// Subscription management
export { subscribeToPlan } from './subscriptionManager';

// Legacy function for compatibility
export { checkUserFreeTierLimit } from './subscriptionManager';
