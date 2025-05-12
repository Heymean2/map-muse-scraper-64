
// This file re-exports all scraper-related functions

// Export core scraper functions from their respective modules
export { 
  startScraping,
  getUserScrapingTasks,
  getScrapingResults 
} from './taskManagement';

export {
  getUserPlanInfo,
  checkUserFreeTierLimit
} from './planInfo';

export {
  updateUserRows,
  updateUserCredits
} from './userStatsService';

export {
  purchaseCredits,
  subscribeToPlan
} from './subscriptionManager';

export {
  downloadCsvFromUrl
} from './files';

// Export the form options functions
export { 
  getScraperCategories,
  getScraperCountries,
  getScraperStates,
  getScraperDataTypes,
  getScraperRatings 
} from './formOptions';

// Export backend integration functions
export {
  sendTaskToBackend
} from './backendIntegration';
