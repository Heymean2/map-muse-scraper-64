
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
    
    console.log("Session refreshed successfully, token available:", !!refreshResult.session.access_token);
    
    // Wait a moment for token to propagate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Make the edge function call with explicit auth headers
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: { 
        keywords, 
        country, 
        states, 
        fields, 
        rating 
      },
      headers: {
        Authorization: `Bearer ${refreshResult.session.access_token}`
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
