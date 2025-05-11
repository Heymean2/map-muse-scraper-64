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
  features?: string[];
}
