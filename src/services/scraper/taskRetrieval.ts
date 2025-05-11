
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
      .eq('user_id_uuid', user.id)
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
      // Try to determine if taskId is a UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(taskId);
      
      let query = supabase
        .from('scraping_requests')
        .select('*')
        .eq('user_id_uuid', user.id);
      
      // Use the appropriate column based on whether taskId is a UUID
      if (isUuid) {
        query = query.eq('task_id_uuid', taskId);
      } else {
        // For backward compatibility
        query = query.eq('task_id', taskId);
      }
      
      const { data, error } = await query.single();
        
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
        .eq('user_id_uuid', user.id)
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
