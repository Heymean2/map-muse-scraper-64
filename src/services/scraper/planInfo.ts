
import { supabase } from "@/integrations/supabase/client";
import { UserPlanInfo } from "./types";

/**
 * Get user's current plan information
 */
export async function getUserPlanInfo(): Promise<UserPlanInfo> {
  try {
    // Ensure we have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Authentication required");
    }

    const userId = session.user.id;
    
    // Get user profile with plan information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, pricing_plans(id, name, price, billing_period, features, row_limit, credits, price_per_credit)')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw new Error("Failed to fetch user profile");
    }

    // Check if user has credits-based plan records
    const { data: creditTransactions, error: creditError } = await supabase
      .from('billing_transactions')
      .select('plan_id, credits_purchased')
      .eq('user_id', userId)
      .eq('billing_period', 'credits')
      .order('transaction_date', { ascending: false })
      .limit(1);
    
    if (creditError) {
      console.error("Error fetching user credit transactions:", creditError);
    }

    // Extract plan details
    const planDetails = profile?.pricing_plans;
    const hasBothPlanTypes = 
      planDetails?.billing_period === 'monthly' && 
      creditTransactions && 
      creditTransactions.length > 0;
    
    // Extract features from JSON or provide defaults
    const featuresObj = planDetails?.features ? 
      (typeof planDetails.features === 'string' ? 
        JSON.parse(planDetails.features) : 
        planDetails.features) : 
      {};
    
    // Construct response object
    return {
      planId: profile?.plan_id,
      planName: planDetails?.name || 'Free Plan',
      billing_period: planDetails?.billing_period || 'free',
      isFreePlan: !profile?.plan_id || profile.plan_id === 1,
      hasAccess: true,
      hasBothPlanTypes,
      totalRows: profile?.total_rows || 0,
      freeRowsLimit: planDetails?.row_limit || 100,
      credits: profile?.credits || 0,
      price_per_credit: planDetails?.price_per_credit,
      features: {
        reviews: featuresObj.reviews || false,
        analytics: featuresObj.analytics || false,
        apiAccess: featuresObj.apiAccess || false
      }
    };
  } catch (error) {
    console.error("Error checking user plan:", error);
    return {
      planId: undefined,
      planName: 'Free Plan',
      isFreePlan: true,
      hasAccess: false,
      totalRows: 0,
      freeRowsLimit: 100,
      credits: 0,
      features: {
        reviews: false,
        analytics: false,
        apiAccess: false
      }
    };
  }
}

/**
 * Check if a user has reached their free tier limit
 */
export async function checkUserFreeTierLimit(): Promise<{ hasReachedLimit: boolean, rowsUsed: number, rowsLimit: number }> {
  try {
    const planInfo = await getUserPlanInfo();
    
    // Users with paid plans don't have limits
    if (!planInfo.isFreePlan) {
      return {
        hasReachedLimit: false,
        rowsUsed: planInfo.totalRows || 0,
        rowsLimit: Infinity
      };
    }
    
    // For free tier users, check against limit
    const isExceeded = (planInfo.totalRows || 0) >= (planInfo.freeRowsLimit || 100);
    
    return {
      hasReachedLimit: isExceeded,
      rowsUsed: planInfo.totalRows || 0,
      rowsLimit: planInfo.freeRowsLimit || 100
    };
  } catch (error) {
    console.error("Error checking free tier limit:", error);
    return { hasReachedLimit: false, rowsUsed: 0, rowsLimit: 100 };
  }
}
