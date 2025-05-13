
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
  task_id?: string; // Represented as string but is a UUID in the database
  user_id?: string;
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
  total_count?: number; // Count data
  stage?: string; // Current processing stage (collecting, processing, exporting)
  progress?: string | number; // Progress percentage or value
  current_state?: string; // Detailed state information
  metadata?: any; // Additional metadata about the task
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
  task_id?: string; // Represented as string but is a UUID in the database
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

// New interface for task progress details
export interface TaskProgress {
  currentStage: string;
  previousStages?: string[];
  nextStages?: string[];
  percentage: number;
  detailedState: string;
  startTime?: string;
  estimatedCompletion?: string;
}
