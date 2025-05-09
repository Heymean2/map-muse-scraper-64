
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

    // Call our secure edge function
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
