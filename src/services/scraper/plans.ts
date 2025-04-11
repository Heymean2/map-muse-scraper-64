
import { supabase } from "@/integrations/supabase/client";
import { UserPlanInfo, FreeTierLimitInfo } from "./types";
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
      .select('plan_id')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw profileError;
    }
    
    // Get plan details
    const { data: planData, error: planError } = await supabase
      .from('pricing_plans')
      .select('name, row_limit')
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
    const isFreePlan = planName === 'Free Plan';
    const isExceeded = isFreePlan && totalRows > freeRowsLimit;
    
    return {
      isFreePlan,
      planName,
      totalRows,
      freeRowsLimit,
      isExceeded
    };
  } catch (error) {
    console.error("Error checking user plan:", error);
    // Default to free plan with exceeded limit
    return {
      isFreePlan: true,
      planName: 'Free Plan',
      totalRows: 0,
      freeRowsLimit: DEFAULT_FREE_TIER_LIMIT,
      isExceeded: false
    };
  }
}

/**
 * Check if user has exceeded free tier limit
 * @deprecated Use getUserPlanInfo instead
 */
export async function checkUserFreeTierLimit(): Promise<FreeTierLimitInfo> {
  const planInfo = await getUserPlanInfo();
  
  return {
    isExceeded: planInfo.isExceeded,
    totalRows: planInfo.totalRows,
    freeRowsLimit: planInfo.freeRowsLimit
  };
}

/**
 * Update total rows used by user
 */
export async function updateUserRows(rowCount: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Fix: Convert current_rows to a number to make TypeScript happy
    const numericRowCount = Number(rowCount);
    
    // Alternative approach: use a simpler direct query rather than RPC
    const { error } = await supabase
      .from('profiles')
      .update({ 
        total_rows: supabase.rpc('increment_rows_calculation', { 
          current_rows: numericRowCount 
        }) 
      })
      .eq('id', user.id);
      
    if (error) {
      console.error("Error updating user rows:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error updating user row count:", error);
  }
}
