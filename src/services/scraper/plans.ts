
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
      .select('name, row_limit, credits, price_per_credit')
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
    const credits = profileData?.credits || 0;
    const price_per_credit = planData?.price_per_credit || 0;
    
    return {
      isFreePlan,
      planName,
      totalRows,
      freeRowsLimit,
      isExceeded,
      credits,
      price_per_credit
    };
  } catch (error) {
    console.error("Error checking user plan:", error);
    // Default to free plan with exceeded limit
    return {
      isFreePlan: true,
      planName: 'Free Plan',
      totalRows: 0,
      freeRowsLimit: DEFAULT_FREE_TIER_LIMIT,
      isExceeded: false,
      credits: 0,
      price_per_credit: 0.00299
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
    freeRowsLimit: planInfo.freeRowsLimit,
    credits: planInfo.credits
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
    
    // Fix: Use a direct update instead of RPC
    const { error } = await supabase
      .from('profiles')
      .update({ total_rows: numericRowCount })
      .eq('id', user.id);
      
    if (error) {
      console.error("Error updating user rows:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error updating user row count:", error);
  }
}

/**
 * Update user's credits
 */
export async function updateUserCredits(creditAmount: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get current credits
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching user credits:", fetchError);
      throw fetchError;
    }
    
    const currentCredits = profileData?.credits || 0;
    const newCredits = currentCredits + creditAmount;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: Math.max(0, newCredits) })
      .eq('id', user.id);
      
    if (updateError) {
      console.error("Error updating user credits:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Error updating user credits:", error);
  }
}

/**
 * Purchase credits
 */
export async function purchaseCredits(packageCount: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get credit package details
    const { data: packageData, error: packageError } = await supabase
      .from('pricing_plans')
      .select('credits')
      .eq('name', 'Credit Package')
      .single();
      
    if (packageError) {
      console.error("Error fetching credit package:", packageError);
      throw packageError;
    }
    
    const creditsPerPackage = packageData?.credits || 1000;
    const totalCredits = creditsPerPackage * packageCount;
    
    // In a real application, here we would process payment
    // For now, we'll just update the user's credits
    await updateUserCredits(totalCredits);
    
    return true;
  } catch (error) {
    console.error("Error purchasing credits:", error);
    return false;
  }
}
