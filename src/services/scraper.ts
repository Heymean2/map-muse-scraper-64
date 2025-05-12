
// This file is now just a facade that re-exports from the modular scraper services
// This maintains backward compatibility while allowing for better code organization

export { 
  startScraping,
  getUserScrapingTasks,
  getScrapingResults,
  getUserPlanInfo,
  checkUserFreeTierLimit,
  updateUserRows,
  updateUserCredits,
  purchaseCredits,
  subscribeToPlan,
  downloadCsvFromUrl,
  getScraperCategories,
  getScraperCountries,
  getScraperStates,
  getScraperDataTypes,
  getScraperRatings,
  sendTaskToBackend
} from './scraper/index';

