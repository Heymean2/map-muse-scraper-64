
import { supabase } from "@/integrations/supabase/client";
import { ScrapingRequest } from "./types";
import { toast } from "sonner";

// Start a new scraping task
export async function startScraping(scrapingConfig: {
  keywords: string;
  country: string;
  states: string[];
  fields: string[];
  rating?: string;
}) {
  try {
    console.log("Starting scraping with config:", scrapingConfig);
    
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
      body: scrapingConfig,
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

// Get user's scraping tasks
export async function getUserScrapingTasks(): Promise<ScrapingRequest[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('scraping_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching scraping tasks:", error);
      throw error;
    }
    
    // Ensure created_at is present for all records
    return (data || []).map(item => ({
      ...item,
      created_at: item.created_at || new Date().toISOString()
    }));
  } catch (error: any) {
    console.error("Error getting user scraping tasks:", error);
    toast.error("Failed to load your scraping tasks");
    return [];
  }
}

// Define return types more explicitly
type ScrapingResultSingle = ScrapingRequest & {
  search_info?: any;
  data?: any[];
  total_count?: number;
  limited?: boolean;
  current_plan?: any;
};

type ScrapingResultMultiple = {
  tasks: ScrapingRequest[];
};

// Get scraping results for a specific task or all tasks
export async function getScrapingResults(taskId?: string | null): Promise<ScrapingResultSingle | ScrapingResultMultiple | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    if (taskId) {
      // Get single task details
      const { data, error } = await supabase
        .from('scraping_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .single();
        
      if (error) {
        console.error("Error fetching scraping result:", error);
        throw error;
      }
      
      // Ensure created_at exists
      const taskWithDefaults = {
        ...data,
        created_at: data.created_at || new Date().toISOString()
      };
      
      // Create search_info object
      const searchInfo = {
        keywords: data.keywords,
        location: `${data.country} - ${data.states}`,
        fields: data.fields
      };
      
      // Return with additional fields
      const result: ScrapingResultSingle = {
        ...taskWithDefaults,
        search_info: searchInfo
      };
      
      return result;
    } else {
      // Get all tasks
      const { data, error } = await supabase
        .from('scraping_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching scraping results:", error);
        throw error;
      }
      
      // Ensure created_at exists for all records
      const tasksWithDefaults = (data || []).map(item => ({
        ...item,
        created_at: item.created_at || new Date().toISOString()
      }));
      
      return { tasks: tasksWithDefaults } as ScrapingResultMultiple;
    }
  } catch (error: any) {
    console.error("Error getting scraping results:", error);
    return null;
  }
}
