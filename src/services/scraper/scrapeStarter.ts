
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScraperParams, ScraperResponse } from "./types";
import { getUserPlanInfo } from "./userPlanService";

/**
 * Start a new scraping task
 */
export async function startScraping({
  keywords,
  country,
  states,
  fields,
  rating
}: ScraperParams): Promise<ScraperResponse> {
  try {
    console.log("Starting scraping with config:", { keywords, country, states, fields, rating });
    
    // Check user's plan to see if they have enough credits
    const planInfo = await getUserPlanInfo();
    
    // For credit-based plans, check if user has enough credits
    const isCreditPlan = planInfo?.planName?.includes("Credit");
    if (isCreditPlan && (planInfo?.credits || 0) <= 0) {
      toast.error("You don't have enough credits. Please purchase more credits to continue.");
      return { success: false, error: "Insufficient credits" };
    }
    
    // Get fresh session token to ensure auth is valid
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "Authentication error: " + sessionError.message };
    }
    
    if (!sessionData.session) {
      console.error("No active session found");
      toast.error("No active session found. Please sign in again.");
      return { success: false, error: "No active session" };
    }
    
    // Force token refresh to ensure we have the freshest possible token
    const { data: refreshResult, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      toast.error("Session refresh failed. Please sign in again.");
      return { success: false, error: "Failed to refresh session: " + refreshError.message };
    }
    
    if (!refreshResult || !refreshResult.session) {
      console.error("No session after refresh");
      toast.error("Session refresh failed. Please sign in again.");
      return { success: false, error: "No session after refresh" };
    }
    
    const accessToken = refreshResult.session.access_token;
    console.log("Session refreshed successfully, token available:", !!accessToken);
    
    // Wait a moment for token to propagate
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Make the edge function call with explicit auth headers
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      method: 'POST',
      body: { 
        keywords, 
        country, 
        states, 
        fields, 
        rating,
        isCreditPlan  // Pass this flag to the edge function
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (error) {
      console.error("Error from edge function:", error);
      toast.error(error.message || "Failed to start scraping");
      return { success: false, error: error.message || "Failed to start scraping" };
    }
    
    console.log("Edge function call successful:", data);
    
    // If using credits, deduct credits immediately as a UX improvement
    // (actual deduction will happen server-side as well)
    if (isCreditPlan && planInfo?.credits) {
      const estimatedRowCount = 100; // This is a placeholder, actual count will be determined server-side
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          credits: Math.max(0, (planInfo.credits - estimatedRowCount)) 
        })
        .eq('id', refreshResult.session.user.id);
      
      if (updateError) {
        console.error("Error updating credits (client-side):", updateError);
      }
    }
    
    return { 
      success: true, 
      task_id: data?.taskId || data?.task_id 
    };
  } catch (error: any) {
    console.error("Error starting scraping:", error);
    return { success: false, error: error.message || "Failed to start scraping" };
  }
}
