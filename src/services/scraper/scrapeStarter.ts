
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
    
    // Check for user authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required. Please sign in to use this feature.");
      return { success: false, error: "Authentication required" };
    }
    
    // Get fresh session token to ensure auth is valid
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "Authentication error" };
    }
    
    if (!sessionData.session) {
      console.error("No session found");
      toast.error("No active session found. Please sign in again.");
      return { success: false, error: "No active session" };
    }
    
    // Ensure token is fresh before making the request
    try {
      console.log("Refreshing token before making edge function call");
      const { data: refreshResult, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Continue with current token as a fallback
      } else if (refreshResult && refreshResult.session) {
        console.log("Token refreshed successfully");
      }
    } catch (refreshError) {
      console.error("Exception during token refresh:", refreshError);
      // Continue with current token as a fallback
    }
    
    // Get the latest session after potential refresh
    const { data: freshSessionData } = await supabase.auth.getSession();
    const freshAccessToken = freshSessionData.session?.access_token;
    
    if (!freshAccessToken) {
      console.error("No access token available");
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "No access token available" };
    }
    
    console.log("Calling edge function with fresh access token");
    
    // Make the edge function call with explicit headers
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: { keywords, country, states, fields, rating },
      headers: {
        Authorization: `Bearer ${freshAccessToken}`
      }
    });
    
    if (error) {
      console.error("Error from edge function:", error);
      toast.error(error.message || "Failed to start scraping");
      throw error;
    }
    
    console.log("Edge function call successful:", data);
    return { success: true, task_id: data?.taskId };
  } catch (error: any) {
    console.error("Error starting scraping:", error);
    return { success: false, error: error.message || "Failed to start scraping" };
  }
}
