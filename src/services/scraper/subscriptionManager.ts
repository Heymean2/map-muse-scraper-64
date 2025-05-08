
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkUserFreeTierLimit } from "./plans";

// Subscribe to a plan
export async function subscribeToPlan(planId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    // Convert string planId to number if needed
    const numericPlanId = parseInt(planId);
    
    if (isNaN(numericPlanId)) {
      return { success: false, error: "Invalid plan ID" };
    }
    
    // Update the user's plan in the database
    const { error } = await supabase
      .from('profiles')
      .update({ plan_id: numericPlanId })
      .eq('id', user.id);
        
    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
    
    toast.success("Plan updated successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Error subscribing to plan:", error);
    toast.error(error.message || "Failed to subscribe to plan");
    return { success: false, error: error.message || "Failed to subscribe to plan" };
  }
}

// Export checkUserFreeTierLimit for backward compatibility
export { checkUserFreeTierLimit };
