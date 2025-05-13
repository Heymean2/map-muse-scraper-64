import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrapingRequest, ScrapingResultSingle, ScrapingResultMultiple, TaskProgress } from "./types";

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
      task_id: item.task_id ? item.task_id.toString() : undefined,
      // Parse progress to number if it's a string
      progress: item.progress ? parseFloat(item.progress) : undefined
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
 * Helper function to parse progress value to percentage
 */
export function parseProgressValue(progress?: string | number): number {
  if (progress === undefined || progress === null) return 0;
  if (typeof progress === 'number') return progress;
  
  // Try to parse as number
  const numValue = parseFloat(progress);
  if (isNaN(numValue)) return 0;
  
  // If it's already a percentage (0-100), return as is
  if (numValue >= 0 && numValue <= 100) return numValue;
  
  // Otherwise convert to percentage (assuming a 0-1 scale)
  return numValue * 100;
}

/**
 * Process and enhance task data with additional metadata
 */
function processTaskData(data: any): ScrapingRequest {
  // Ensure created_at exists and convert UUID to string
  const taskWithDefaults = {
    ...data,
    created_at: data.created_at || new Date().toISOString(),
    task_id: data.task_id ? data.task_id.toString() : undefined,
    // Ensure total_count is present
    total_count: data.total_count || data.row_count || 0,
    // Parse progress to a number if it's a string
    progress: parseProgressValue(data.progress)
  };
  
  return taskWithDefaults;
}

/**
 * Get task progress details
 */
export function getTaskProgress(task: ScrapingRequest): TaskProgress {
  // Default stage sequence
  const stages = ['queued', 'collecting', 'processing', 'exporting', 'completed'];
  
  // Determine current stage
  const currentStage = task.stage || (
    task.status === 'completed' ? 'completed' : 
    task.status === 'processing' ? 'processing' : 
    'queued'
  );
  
  // Find current stage index
  const currentIndex = stages.indexOf(currentStage);
  
  // Get previous and next stages
  const previousStages = currentIndex > 0 ? stages.slice(0, currentIndex) : [];
  const nextStages = currentIndex < stages.length - 1 ? stages.slice(currentIndex + 1) : [];
  
  // Calculate percentage based on progress or status
  let percentage = 0;
  if (task.progress !== undefined) {
    percentage = typeof task.progress === 'number' ? task.progress : parseFloat(task.progress) || 0;
  } else if (task.status === 'completed') {
    percentage = 100;
  } else if (currentIndex >= 0) {
    // Approximate percentage based on stage
    percentage = (currentIndex / (stages.length - 1)) * 100;
  }
  
  return {
    currentStage,
    previousStages,
    nextStages,
    percentage,
    detailedState: task.current_state || currentStage,
    startTime: task.created_at,
    estimatedCompletion: undefined // Could be calculated based on progress rate
  };
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
      console.log(`Getting scraping results for task: ${taskId}`);
      
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
      
      console.log("Raw task data from Supabase:", data);
      
      if (!data) {
        console.log("No data found for task:", taskId);
        return null;
      }
      
      // Process task data with enhanced metadata
      const processedTask = processTaskData(data);
      
      // Create search_info object
      const searchInfo = {
        keywords: data.keywords,
        location: `${data.country} - ${data.states}`,
        fields: ensureArray(data.fields),
        rating: data.rating
      };
      
      // Return with additional fields
      const result: ScrapingResultSingle = {
        ...processedTask,
        search_info: searchInfo
      };
      
      console.log("Processed scraping result:", result);
      
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
      
      console.log("Raw tasks data from Supabase:", data);
      
      // Process all tasks with enhanced metadata
      const processedTasks = (data || []).map(item => processTaskData(item));
      
      return { tasks: processedTasks } as ScrapingResultMultiple;
    }
  } catch (error: any) {
    console.error("Error getting scraping results:", error);
    return null;
  }
}
