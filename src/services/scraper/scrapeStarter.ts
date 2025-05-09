
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error("Auth error:", authError);
      toast.error("Authentication error: " + authError.message);
      return { success: false, error: "Authentication error: " + authError.message };
    }
    
    if (!user) {
      toast.error("Authentication required. Please sign in to use this feature.");
      return { success: false, error: "Authentication required" };
    }
    
    // Get fresh session token to ensure auth is valid
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "Authentication error: " + sessionError.message };
    }
    
    if (!sessionData.session) {
      console.error("No session found");
      toast.error("No active session found. Please sign in again.");
      return { success: false, error: "No active session" };
    }
    
    // Ensure token is fresh before making the request
    let accessToken = sessionData.session.access_token;
    try {
      console.log("Refreshing token before making edge function call");
      const { data: refreshResult, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // If refresh fails, try to get a session again as fallback
        const { data: retrySession } = await supabase.auth.getSession();
        if (retrySession?.session) {
          accessToken = retrySession.session.access_token;
          console.log("Retrieved token via fallback method");
        } else {
          // Continue with current token as a last resort
          console.log("Using existing token as fallback");
        }
      } else if (refreshResult && refreshResult.session) {
        console.log("Token refreshed successfully");
        accessToken = refreshResult.session.access_token;
      }
    } catch (refreshError) {
      console.error("Exception during token refresh:", refreshError);
      // Continue with current token as a fallback
    }
    
    if (!accessToken) {
      console.error("No access token available");
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "No access token available" };
    }
    
    console.log("Calling edge function with access token length:", accessToken.length);
    
    // Use the API key constant directly to avoid accessing protected property
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bHduaXpmZ2dwbGN0ZHR1anN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzUwMjYsImV4cCI6MjA1NzYxMTAyNn0.-ajeJzWjufIy4RUkotdMgYWprFuQOJzA7a_aIYuCPA4";
    
    // Make the edge function call with explicit headers
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: { keywords, country, states, fields, rating },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Also add apikey explicitly to ensure it's present
        apikey: apiKey
      }
    });
    
    if (error) {
      console.error("Error from edge function:", error);
      toast.error(error.message || "Failed to start scraping");
      return { success: false, error: error.message || "Failed to start scraping" };
    }
    
    console.log("Edge function call successful:", data);
    return { success: true, task_id: data?.taskId };
  } catch (error: any) {
    console.error("Error starting scraping:", error);
    return { success: false, error: error.message || "Failed to start scraping" };
  }
}
