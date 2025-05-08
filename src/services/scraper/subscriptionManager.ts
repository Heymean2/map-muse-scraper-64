
import { supabase } from "@/integrations/supabase/client";
import { FreeTierLimitInfo } from "./types";
import { getUserPlanInfo } from "./tasks";

// Subscribe to a plan
export async function subscribeToPlan(planId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    // In a real implementation, this would:
    // 1. Call Stripe to create a subscription
    // 2. Store the subscription details in the database
    
    // Check if the pricing_plan exists
    const { data: plan, error: planError } = await supabase
      .from('pricing_plans')
      .select('id')
      .eq('id', planId)
      .single();
      
    if (planError || !plan) {
      console.error("Error finding plan:", planError);
      return { success: false, error: "Invalid plan selected" };
    }
    
    // Check if a user subscription entry exists
    const { data: existingSubscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (subError) {
      console.error("Error checking subscription:", subError);
      return { success: false, error: "Failed to check subscription status" };
    }
    
    if (existingSubscription) {
      // Update existing subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ plan_id: planId })
        .eq('id', existingSubscription.id);
        
      if (error) throw error;
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active'
        });
        
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error subscribing to plan:", error);
    return { success: false, error: error.message || "Failed to subscribe to plan" };
  }
}

// For compatibility with existing code
export async function checkUserFreeTierLimit(): Promise<FreeTierLimitInfo> {
  // With subscription model, we don't need to check free tier limits
  return {
    isExceeded: false,
    totalRows: 0,
    freeRowsLimit: Infinity,
    credits: 0
  };
}
