
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrapingRequest, UserPlanInfo } from "./services/scraper/types";
import { getUserPlanInfo } from "./scraper/planInfo";

// Export getUserPlanInfo from tasks.ts
export { getUserPlanInfo } from "./scraper/planInfo";

// Start a new scraping task
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
      return { success: false, error: "Authentication required" };
    }
    
    // Get user's plan info to check restrictions
    const userPlanInfo = await getUserPlanInfo();
    const planName = userPlanInfo?.planName?.toLowerCase() || "free";
    
    // Check if the user has access to all requested data fields based on their plan
    if (scrapingConfig.fields.includes("reviews") && !planName.includes("pro") && !planName.includes("enterprise")) {
      return { 
        success: false, 
        error: "Your current plan does not allow access to review data. Please upgrade to Pro." 
      };
    }
    
    // In a real implementation, this would call a serverless function
    // to start the scraping task
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: {
        ...scrapingConfig,
        userId: user.id,
      }
    });

    if (error) throw error;
    
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
    const response = await fetch(url);
    
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
      isExceeded: false, // We're using subscription model now
      totalRows: 0,
      freeRowsLimit: Infinity, // Unlimited rows
      credits: 0
    };
  });
}
