
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
    
    return data || [];
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
      
      // Return with additional fields that may be added by the API
      const result: ScrapingResultSingle = {
        ...data,
        search_info: data.search_info || {
          keywords: data.keywords,
          location: `${data.country} - ${data.states}`,
          fields: data.fields
        }
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
      
      return { tasks: data || [] } as ScrapingResultMultiple;
    }
  } catch (error: any) {
    console.error("Error getting scraping results:", error);
    return null;
  }
}
