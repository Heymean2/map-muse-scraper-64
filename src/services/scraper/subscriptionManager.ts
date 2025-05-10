
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserPlanInfo } from "./userPlanService";

// Subscribe to a plan
export async function subscribeToPlan(planId: string | number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    // Convert string planId to number if needed
    const numericPlanId = typeof planId === 'string' ? parseInt(planId) : planId;
    
    if (isNaN(numericPlanId)) {
      return { success: false, error: "Invalid plan ID" };
    }
    
    // Get the current plan info to determine if we're changing plan types
    const currentPlanInfo = await getUserPlanInfo();
    
    // Get new plan details
    const { data: newPlanData, error: newPlanError } = await supabase
      .from('pricing_plans')
      .select('billing_period, name')
      .eq('id', numericPlanId)
      .single();
    
    if (newPlanError) {
      console.error("Error fetching plan details:", newPlanError);
      return { success: false, error: "Could not retrieve plan information" };
    }
    
    // Check if we're switching between subscription and credit-based plan
    const isSwitchingPlanType = currentPlanInfo.billing_period !== newPlanData.billing_period;
    
    // Update the user's plan in the database
    const { error } = await supabase
      .from('profiles')
      .update({ plan_id: numericPlanId })
      .eq('id', user.id);
        
    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
    
    toast.success(`Plan updated to ${newPlanData.name} successfully`);
    
    if (isSwitchingPlanType) {
      toast.info(`You've switched to a ${newPlanData.billing_period === 'credits' ? 'pay-per-use' : 'subscription'} plan`);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error subscribing to plan:", error);
    toast.error(error.message || "Failed to subscribe to plan");
    return { success: false, error: error.message || "Failed to subscribe to plan" };
  }
}
