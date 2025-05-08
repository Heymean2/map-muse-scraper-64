
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
  getUserScrapingTasks
} from './taskManagement';

// User plan information
export { 
  getUserPlanInfo 
} from './userPlanService';

export {
  defaultFreePlan
} from './planInfo';

// User statistics
export {
  updateUserRows,
  updateUserCredits
} from './userStatsService';

// Credit management
export {
  purchaseCredits
} from './creditService';

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
export { checkUserFreeTierLimit } from './userPlanService';
