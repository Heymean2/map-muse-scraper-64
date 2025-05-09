
import { supabase } from "@/integrations/supabase/client";
import { ScrapingRequest } from "./types";
import { toast } from "sonner";
import { getUserPlanInfo } from "./planInfo";

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
    
    // Always refresh token before making the request
    try {
      console.log("Token refresh started - ensuring fresh credentials");
      const refreshResult = await supabase.auth.refreshSession();
      
      if (refreshResult.error) {
        console.error("Failed to refresh token:", refreshResult.error);
        toast.error("Session refresh failed. Please sign in again.");
        return { success: false, error: "Session refresh failed" };
      }
      
      console.log("Token refreshed successfully");
    } catch (refreshError) {
      console.error("Exception during token refresh:", refreshError);
      // Continue with current token, the function will handle if it's invalid
    }

    console.log("Calling edge function with user ID:", user.id);
    
    // IMPORTANT: Get a fresh session after potential refresh
    const { data: freshSession } = await supabase.auth.getSession();
    console.log("Session available:", !!freshSession.session);
    
    if (!freshSession.session || !freshSession.session.access_token) {
      console.error("No access token available after refresh");
      toast.error("Authentication error. Please sign in again.");
      return { success: false, error: "No access token available" };
    }
    
    // Make the edge function call with explicit authorization
    const { data, error } = await supabase.functions.invoke('start-scraping', {
      body: scrapingConfig,
      headers: {
        Authorization: `Bearer ${freshSession.session.access_token}`
      }
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
