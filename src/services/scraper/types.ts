
// Base URL for the scraper API
export const BASE_URL = "https://localhost:4242";

export interface ScraperParams {
  keywords: string;
  country: string;
  states: string[];
  fields: string[];
  rating?: string;
}

export interface ScraperResponse {
  success: boolean;
  user_id?: string;
  task_id?: string;
  message?: string;
  error?: string;
}

export interface ScrapingRequest {
  country: string;
  created_at: string | null;
  fields: string | null;
  id: number;
  keywords: string;
  rating: string | null;
  result_url: string | null;
  states: string;
  status: string | null;
  task_id: string;
  updated_at: string | null;
  user_id: string;
  row_count: number | null;
  result_data?: any[]; // Adding result_data as an optional array property
}

export interface UserPlanInfo {
  isFreePlan: boolean;
  planName: string;
  totalRows: number;
  freeRowsLimit: number;
  isExceeded: boolean;
  credits?: number;
  price_per_credit?: number;
}

export interface FreeTierLimitInfo {
  isExceeded: boolean;
  totalRows: number;
  freeRowsLimit: number;
  credits?: number;
}
