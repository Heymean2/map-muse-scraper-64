
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrapingRequest, UserPlanInfo } from "@/services/scraper/types";
import { getUserPlanInfo } from "./scraper/planInfo";

// Export getUserPlanInfo from tasks.ts
export { getUserPlanInfo } from "./scraper/planInfo";

// Start a new scraping task using the secure edge function
export async function startScraping(scrapingConfig: {
  keywords: string;
  country: string;
  states: string[];
  fields: string[];
  rating?: string;
}) {
  try {
    // Check for user authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required. Please sign in to use this feature.");
      return { success: false, error: "Authentication required" };
    }
    
    // Get current session to ensure we have a valid token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "Authentication error" };
    }
    
    if (!sessionData.session) {
      toast.error("No active session found. Please sign in again.");
      return { success: false, error: "No active session" };
    }
    
    // Access token may be expired - try refreshing it
    if (isTokenExpiring(sessionData.session)) {
      try {
        console.log("Token may be expiring soon, attempting to refresh...");
        await supabase.auth.refreshSession();
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Continue with current token, the function will handle if it's invalid
      }
    }

    console.log("Calling edge function with user ID:", user.id);
    
    // No need to manually pass authorization - the supabase client will handle this
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: scrapingConfig
    });

    if (error) {
      console.error("Error from edge function:", error);
      toast.error(error.message || "Failed to start scraping");
      throw error;
    }
    
    return { success: true, task_id: data?.taskId };
  } catch (error: any) {
    console.error("Error starting scraping:", error);
    return { success: false, error: error.message || "Failed to start scraping" };
  }
}

// Helper to check if token is going to expire soon (within 5 minutes)
function isTokenExpiring(session: any) {
  if (!session || !session.expires_at) return true;
  
  const expiresAt = new Date(session.expires_at * 1000);
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  
  return expiresAt.getTime() - now.getTime() < fiveMinutes;
}

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
    const { error } = await supabase
      .from('profiles')
      .update({ plan_id: parseInt(planId) })
      .eq('id', user.id);
        
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

// Download CSV from URL
export async function downloadCsvFromUrl(url: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required. Please sign in to download results.");
      throw new Error("Authentication required");
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error: any) {
    console.error("Error downloading CSV:", error);
    toast.error("Failed to download CSV data");
    throw error;
  }
}

// Re-export from taskManagement
export { getScrapingResults, getUserScrapingTasks } from "./scraper/taskManagement";

// For compatibility with existing code
export function checkUserFreeTierLimit() {
  return getUserPlanInfo().then(planInfo => {
    return {
      isExceeded: planInfo.isExceeded || false,
      totalRows: planInfo.totalRows || 0,
      freeRowsLimit: planInfo.freeRowsLimit || Infinity,
      credits: planInfo.credits || 0
    };
  });
}
