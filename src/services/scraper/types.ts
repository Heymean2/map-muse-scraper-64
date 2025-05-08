
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
  row_count?: number;
  created_at?: string;
  updated_at?: string;
  total_results?: number;
  search_info?: any;
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
}

export interface FreeTierLimitInfo {
  isExceeded: boolean;
  totalRows: number;
  freeRowsLimit: number;
  credits: number;
}
