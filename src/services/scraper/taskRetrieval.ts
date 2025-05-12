
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrapingRequest, ScrapingResultSingle, ScrapingResultMultiple } from "./types";

/**
 * Get user's scraping tasks
 */
export async function getUserScrapingTasks(): Promise<ScrapingRequest[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // Query using UUID fields
    const { data, error } = await supabase
      .from('scraping_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching scraping tasks:", error);
      throw error;
    }
    
    // Ensure created_at is present for all records and convert UUID to string
    return (data || []).map(item => ({
      ...item,
      created_at: item.created_at || new Date().toISOString(),
      task_id: item.task_id ? item.task_id.toString() : undefined
    }));
  } catch (error: any) {
    console.error("Error getting user scraping tasks:", error);
    toast.error("Failed to load your scraping tasks");
    return [];
  }
}

/**
 * Helper function to ensure fields is an array
 */
function ensureArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Handle comma-separated string
    return value.split(',').map(item => item.trim());
  }
  if (value === null || value === undefined) return [];
  return [String(value)]; // Convert single value to array
}

/**
 * Get scraping results for a specific task or all tasks
 */
export async function getScrapingResults(
  taskId?: string | null
): Promise<ScrapingResultSingle | ScrapingResultMultiple | null> {
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
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching scraping result:", error);
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      // Ensure created_at exists and convert UUID to string
      const taskWithDefaults = {
        ...data,
        created_at: data.created_at || new Date().toISOString(),
        task_id: data.task_id ? data.task_id.toString() : undefined
      };
      
      // Create search_info object
      const searchInfo = {
        keywords: data.keywords,
        location: `${data.country} - ${data.states}`,
        fields: ensureArray(data.fields)
      };
      
      // Return with additional fields
      const result: ScrapingResultSingle = {
        ...taskWithDefaults,
        search_info: searchInfo
      };
      
      return result;
    } else {
      // Get all tasks for the user
      const { data, error } = await supabase
        .from('scraping_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching scraping results:", error);
        throw error;
      }
      
      // Ensure created_at exists for all records and convert UUID to string
      const tasksWithDefaults = (data || []).map(item => ({
        ...item,
        created_at: item.created_at || new Date().toISOString(),
        task_id: item.task_id ? item.task_id.toString() : undefined
      }));
      
      return { tasks: tasksWithDefaults } as ScrapingResultMultiple;
    }
  } catch (error: any) {
    console.error("Error getting scraping results:", error);
    return null;
  }
}
