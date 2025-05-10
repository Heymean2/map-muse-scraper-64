
export interface ScraperParams {
  keywords: string;
  location?: string;
  country?: string;
  states?: string[];
  fields?: string[];
  rating?: string;
}

export interface ScraperResponse {
  success: boolean;
  error?: string;
  task_id?: string;
}

export interface ScrapingRequest {
  id?: number | string;
  task_id: string;
  user_id: string;
  keywords: string;
  country: string;
  states: string;
  fields?: string;
  rating?: string;
  status?: string;
  result_url?: string;
  json_result_url?: string; // New field for JSON result URL
  row_count?: number;
  created_at: string; // Make this required to match TaskItem expectations
  updated_at?: string;
  total_results?: number;
  search_info?: any; // Add this to handle search_info in taskManagement.ts
}

export interface UserPlanInfo {
  planId: string | null;
  planName: string;
  hasAccess: boolean;
  features: {
    reviews: boolean;
    analytics: boolean;
    apiAccess: boolean;
  };
  isFreePlan?: boolean;
  totalRows?: number;
  freeRowsLimit?: number;
  isExceeded?: boolean;
  credits?: number;
  price_per_credit?: number;
  billing_period?: string;
  isUnlimited?: boolean;
  // New properties for dual plan functionality
  hasBothPlanTypes?: boolean;
  activeSubscription?: boolean;
  subscriptionEndDate?: string;
  creditPlanId?: string | null;
  subscriptionPlanId?: string | null;
  creditPlanName?: string;
}

export interface FreeTierLimitInfo {
  isExceeded: boolean;
  totalRows: number;
  freeRowsLimit: number;
  credits: number;
}

// Define explicit return types for getScrapingResults
export interface ScrapingResultSingle extends ScrapingRequest {
  search_info?: {
    keywords?: string;
    location?: string;
    fields?: string[] | string;
    rating?: string;
  };
  data?: any[];
  total_count?: number;
  limited?: boolean;
  current_plan?: any;
}

export interface ScrapingResultMultiple {
  tasks: ScrapingRequest[];
}
