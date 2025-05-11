
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

// Create a queryClient instance that can be used to invalidate queries
const queryClient = new QueryClient();

/**
 * Purchase credits for the user
 */
export async function purchaseCredits(amount: number, paymentDetails: any) {
  try {
    // Implementation would go here
    console.log("Purchasing credits:", amount, paymentDetails);
    
    // Invalidate user plan info cache to trigger a refetch
    await queryClient.invalidateQueries({ queryKey: ['userPlanInfo'] });
    
    return { success: true };
  } catch (error) {
    console.error("Error purchasing credits:", error);
    return { success: false, error: "Failed to purchase credits" };
  }
}

/**
 * Subscribe user to a plan
 */
export async function subscribeToPlan(planId: number | string, paymentDetails: any) {
  try {
    // Implementation would go here
    console.log("Subscribing to plan:", planId, paymentDetails);
    
    // Invalidate user plan info cache to trigger a refetch
    await queryClient.invalidateQueries({ queryKey: ['userPlanInfo'] });
    
    return { success: true };
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    return { success: false, error: "Failed to subscribe to plan" };
  }
}

/**
 * Force refresh the user plan info
 */
export function refreshUserPlanInfo() {
  return queryClient.invalidateQueries({ queryKey: ['userPlanInfo'] });
}
