
import { supabase } from "@/integrations/supabase/client";
import { UserPlanInfo } from "./types";

// Get user's plan information
export async function getUserPlanInfo(): Promise<UserPlanInfo> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return defaultFreePlan();
    }
    
    // For this implementation, we will use the pricing_plans table directly
    const { data, error } = await supabase.rpc('get_user_plan', { user_id: user.id });
    
    if (error) {
      console.error("Error fetching user plan:", error);
      return defaultFreePlan();
    }
    
    if (!data || data.length === 0) {
      // User doesn't have an active subscription
      return defaultFreePlan();
    }
    
    const plan = data[0];
    const planName = plan.plan_name || "Free";
    const isPro = planName.toLowerCase().includes("pro") || planName.toLowerCase().includes("enterprise");
    
    return {
      planId: plan.plan_id,
      planName: planName,
      hasAccess: true,
      features: {
        reviews: isPro,
        analytics: isPro,
        apiAccess: isPro
      }
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
    }
  };
}
