
import { supabase } from "@/integrations/supabase/client";
import { UserPlanInfo } from "./types";
import { DEFAULT_FREE_TIER_LIMIT } from "./config";

/**
 * Get user's plan information and usage data
 */
export async function getUserPlanInfo(): Promise<UserPlanInfo> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get user profile with plan info
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_id, credits, total_rows')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw profileError;
    }
    
    // Get plan details
    const { data: planData, error: planError } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('id', profileData?.plan_id || 1)
      .single();
      
    if (planError) {
      console.error("Error fetching pricing plan:", planError);
      throw planError;
    }
    
    // Calculate total rows from all scraping requests
    const { data: scrapeData, error: scrapeError } = await supabase
      .from('scraping_requests')
      .select('row_count')
      .eq('user_id', user.id);
      
    if (scrapeError) {
      console.error("Error fetching scraping requests:", scrapeError);
      throw scrapeError;
    }
    
    // Sum up all row_count values
    const totalRows = scrapeData.reduce((sum, item) => {
      return sum + (Number(item.row_count) || 0);
    }, 0);
    
    // Default to Free Plan if no plan found
    const planName = planData?.name || 'Free Plan';
    const freeRowsLimit = planData?.row_limit || DEFAULT_FREE_TIER_LIMIT;
    const isFreePlan = planName.toLowerCase().includes('free');
    const isCreditPlan = planData?.billing_period === 'credits';
    const isSubscriptionPlan = planData?.billing_period === 'monthly' && !isFreePlan;
    const isExceeded = isFreePlan && totalRows > freeRowsLimit;
    const credits = profileData?.credits || 0;
    const price_per_credit = planData?.price_per_credit || 0.001;
    
    return {
      planId: profileData?.plan_id?.toString() || null,
      planName,
      hasAccess: true,
      features: {
        reviews: !isFreePlan || isCreditPlan,
        analytics: !isFreePlan || isCreditPlan,
        apiAccess: !isFreePlan && planName.toLowerCase().includes('premium')
      },
      isFreePlan,
      totalRows,
      freeRowsLimit,
      isExceeded,
      credits,
      price_per_credit,
      billing_period: planData?.billing_period,
      isUnlimited: isSubscriptionPlan
    };
  } catch (error) {
    console.error("Error checking user plan:", error);
    // Default to free plan with exceeded limit
    return {
      planId: null,
      planName: 'Free Plan',
      hasAccess: true,
      features: {
        reviews: false,
        analytics: false,
        apiAccess: false
      },
      isFreePlan: true,
      totalRows: 0,
      freeRowsLimit: DEFAULT_FREE_TIER_LIMIT,
      isExceeded: false,
      credits: 0,
      price_per_credit: 0.00299,
      billing_period: 'monthly'
    };
  }
}

/**
 * Check if user has exceeded free tier limit
 * @deprecated Use getUserPlanInfo instead
 */
export async function checkUserFreeTierLimit() {
  const planInfo = await getUserPlanInfo();
  
  return {
    isExceeded: planInfo.isExceeded || false,
    totalRows: planInfo.totalRows || 0,
    freeRowsLimit: planInfo.freeRowsLimit || DEFAULT_FREE_TIER_LIMIT,
    credits: planInfo.credits || 0
  };
}
