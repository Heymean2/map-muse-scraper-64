
import { supabase } from "@/integrations/supabase/client";
import { UserPlanInfo } from "./types";

// Get user's plan information
export async function getUserPlanInfo(): Promise<UserPlanInfo> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return defaultFreePlan();
    }
    
    // For this implementation, we will query the profiles and pricing_plans tables
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_id')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return defaultFreePlan();
    }
    
    const planId = profileData?.plan_id || 1;
    
    const { data: planData, error: planError } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (planError || !planData) {
      console.error("Error fetching pricing plan:", planError);
      return defaultFreePlan();
    }
    
    const planName = planData.name || "Free";
    const isPro = planName.toLowerCase().includes("pro") || planName.toLowerCase().includes("enterprise");
    
    return {
      planId: planData.id.toString(),
      planName: planName,
      hasAccess: true,
      features: {
        reviews: isPro,
        analytics: isPro,
        apiAccess: isPro
      },
      isFreePlan: planName.toLowerCase().includes("free"),
      totalRows: profileData?.total_rows || 0,
      freeRowsLimit: planData.row_limit || 0,
      isExceeded: false,
      credits: profileData?.credits || 0,
      price_per_credit: planData.price_per_credit || 0
    };
  } catch (error) {
    console.error("Error getting user plan:", error);
    return defaultFreePlan();
  }
}

// Helper function to return a default free plan
export function defaultFreePlan(): UserPlanInfo {
  return {
    planId: null,
    planName: "Free",
    hasAccess: true,
    features: {
      reviews: false,
      analytics: false,
      apiAccess: false
    },
    isFreePlan: true,
    totalRows: 0,
    freeRowsLimit: 100,
    isExceeded: false,
    credits: 0,
    price_per_credit: 0.00299
  };
}
