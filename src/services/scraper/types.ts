
export interface UserPlanInfo {
  planId?: number | string;
  planName?: string;
  billing_period?: string;
  isFreePlan?: boolean;
  hasAccess?: boolean;
  hasBothPlanTypes?: boolean;
  totalRows?: number;
  freeRowsLimit?: number;
  credits?: number;
  price_per_credit?: number;
  features?: {
    reviews?: boolean;
    analytics?: boolean;
    apiAccess?: boolean;
  };
  isExceeded?: boolean;
  isUnlimited?: boolean;
  activeSubscription?: boolean;
  creditPlanId?: string | null;
  creditPlanName?: string | null;
  subscriptionPlanId?: string | null;
}

export interface ScrapingRequest {
  id?: number;
  task_id?: string;
  task_id_uuid?: string;
  user_id?: string;
  user_id_uuid?: string;
  keywords: string;
  country: string;
  states: string;
  fields?: string | string[];
  rating?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  result_url?: string;
  json_result_url?: string;
  row_count?: number;
  total_results?: number;
}

export interface ScrapingParams {
  keywords: string;
  country: string;
  states: string | string[];
  fields: string | string[];
  rating?: string;
}

export interface ScraperResponse {
  success: boolean;
  task_id?: string;
  task_uuid?: string;
  error?: string;
}

export interface ScrapingResultSingle extends ScrapingRequest {
  search_info?: {
    keywords: string;
    location: string;
    fields: string[];
  };
  limited?: boolean;
  current_plan?: UserPlanInfo;
}

export interface ScrapingResultMultiple {
  tasks: ScrapingRequest[];
}
