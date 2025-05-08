
import { supabase } from "@/integrations/supabase/client";
import { FreeTierLimitInfo } from "./types";
import { getUserPlanInfo } from "./planInfo";

// Subscribe to a plan
export async function subscribeToPlan(planId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    // In a real implementation with proper database structure, this would:
    // 1. Call Stripe to create a subscription
    // 2. Store the subscription details in the database
    
    // For now, we'll just simulate updating the user's plan
    // via a Supabase RPC function that would handle the database operations
    const { error } = await supabase.rpc('update_user_plan', { 
      p_user_id: user.id,
      p_plan_id: planId
    });
        
    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error subscribing to plan:", error);
    return { success: false, error: error.message || "Failed to subscribe to plan" };
  }
}

// Legacy function for compatibility with existing code
export async function checkUserFreeTierLimit(): Promise<FreeTierLimitInfo> {
  const planInfo = await getUserPlanInfo();
  
  return {
    isExceeded: false, // We're using subscription model now
    totalRows: 0,
    freeRowsLimit: Infinity, // Unlimited rows
    credits: 0
  };
}
