
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScraperParams, ScraperResponse } from "./types";

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
    
    // Ensure token is fresh before making the request
    try {
      // Force token refresh to ensure we have the freshest possible token
      const { data: refreshResult, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Continue with current token if refresh fails
      }
      
      // Wait a moment for token to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (refreshError) {
      console.error("Exception during token refresh:", refreshError);
      // Continue with current token as a fallback
    }
    
    // Make the edge function call with explicit headers
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: { 
        keywords, 
        country, 
        states, 
        fields, 
        rating 
      }
    });
    
    if (error) {
      console.error("Error from edge function:", error);
      toast.error(error.message || "Failed to start scraping");
      return { success: false, error: error.message || "Failed to start scraping" };
    }
    
    console.log("Edge function call successful:", data);
    return { 
      success: true, 
      task_id: data?.taskId || data?.task_id 
    };
  } catch (error: any) {
    console.error("Error starting scraping:", error);
    return { success: false, error: error.message || "Failed to start scraping" };
  }
}
