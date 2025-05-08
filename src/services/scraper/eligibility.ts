
import { supabase } from "@/integrations/supabase/client";
import { getUserPlanInfo } from "./planInfo";

/**
 * Check if user is eligible to start a new scraping task
 */
export async function checkScrapingEligibility(): Promise<{
  eligible: boolean;
  message?: string;
}> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        eligible: false,
        message: "You must be logged in to use this feature"
      };
    }
    
    // Get user plan information
    const userPlanInfo = await getUserPlanInfo();
    
    // If user is on a paid plan, they are eligible
    if (userPlanInfo.planName !== "Free") {
      return { eligible: true };
    }
    
    // For free plans, we'll assume they're eligible unless there's a specific restriction
    // This replaces the previous isExceeded check
    const hasRestriction = false; // Implement actual check if needed
    
    if (hasRestriction) {
      return {
        eligible: false,
        message: "You've reached the limits of the free tier. Please upgrade your plan to continue scraping."
      };
    }
    
    // User is eligible
    return { eligible: true };
  } catch (error) {
    console.error("Error checking scraping eligibility:", error);
    return {
      eligible: false,
      message: "Error checking eligibility. Please try again later."
    };
  }
}
