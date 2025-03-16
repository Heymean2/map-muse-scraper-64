
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Base URL for the scraper API
const BASE_URL = "https://dry-books-find.loca.lt";

export interface ScraperParams {
  keywords: string;
  country: string;
  states: string[];
  fields: string[];
  rating?: string;
}

export interface ScraperResponse {
  success: boolean;
  user_id?: string;
  task_id?: string;
  message?: string;
  error?: string;
}

// Define a type for the scraping_requests table rows that includes result_data
interface ScrapingRequest {
  country: string;
  created_at: string | null;
  fields: string | null;
  id: number;
  keywords: string;
  rating: string | null;
  result_url: string | null;
  states: string;
  status: string | null;
  task_id: string;
  updated_at: string | null;
  user_id: string;
  result_data?: any[]; // Adding result_data as an optional array property
}

/**
 * Start a scraping task
 */
export async function startScraping(params: ScraperParams): Promise<ScraperResponse> {
  try {
    // Get the current user's ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to use this feature");
      return {
        success: false,
        error: "Authentication required"
      };
    }
    
    // Generate a unique task ID
    const taskId = crypto.randomUUID();
    
    // Insert record to Supabase
    const { error: insertError } = await supabase
      .from('scraping_requests')
      .insert({
        user_id: user.id,
        task_id: taskId,
        keywords: params.keywords,
        country: params.country,
        states: params.states.join(','),
        fields: params.fields.join(','),
        rating: params.rating,
        status: 'processing'
      });
      
    if (insertError) {
      console.error("Error saving to Supabase:", insertError);
      return {
        success: false,
        error: insertError.message
      };
    }
    
    // Send request to check_request endpoint
    const response = await fetch(`${BASE_URL}/check_request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_id: user.id, 
        task_id: taskId 
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return {
      success: true,
      user_id: user.id,
      task_id: taskId,
      message: "Scraping request submitted successfully"
    };
  } catch (error) {
    console.error("Error starting scraping:", error);
    toast.error("Failed to start scraping. Please try again.");
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Get the results of a scraping task
 */
export async function getScrapingResults(taskId?: string): Promise<any> {
  try {
    // Get the current user's ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    if (taskId) {
      // Get specific task results from Supabase
      const { data: existingData, error: fetchError } = await supabase
        .from('scraping_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching from Supabase:", fetchError);
        throw fetchError;
      }
      
      if (existingData) {
        // Cast to our interface that includes result_data
        const typedData = existingData as ScrapingRequest;
        
        // Check if result_data exists and is an array
        let dataArray: any[] = [];
        let totalCount = 0;
        
        if (typedData.result_data) {
          // Ensure result_data is an array
          dataArray = Array.isArray(typedData.result_data) 
            ? typedData.result_data 
            : [];
          
          totalCount = dataArray.length;
        }
        
        return {
          data: dataArray,
          status: typedData.status,
          search_info: {
            keywords: typedData.keywords,
            location: `${typedData.country} - ${typedData.states}`,
            fields: typedData.fields
          },
          total_count: totalCount,
          result_url: typedData.result_url,
          created_at: typedData.created_at
        };
      }
    }
    
    // Get all tasks for user if no taskId is provided
    const { data, error } = await supabase
      .from('scraping_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return {
      tasks: data || [],
      total_count: data?.length || 0
    };
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

/**
 * Get all scraping tasks for the current user
 */
export async function getUserScrapingTasks(): Promise<any[]> {
  try {
    // Get the current user's ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    const { data, error } = await supabase
      .from('scraping_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching user scraping tasks:", error);
    throw error;
  }
}

/**
 * Check if user has exceeded free tier limit (500 rows)
 */
export async function checkUserFreeTierLimit(): Promise<{
  isExceeded: boolean;
  totalRows: number;
  freeRowsLimit: number;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get all completed tasks for this user
    const { data, error } = await supabase
      .from('scraping_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed');
      
    if (error) {
      throw error;
    }
    
    // Calculate total rows across all tasks
    let totalRows = 0;
    
    if (data && data.length > 0) {
      data.forEach(task => {
        // Cast to our interface that includes result_data
        const typedTask = task as ScrapingRequest;
        
        if (typedTask.result_data && Array.isArray(typedTask.result_data)) {
          totalRows += typedTask.result_data.length;
        }
      });
    }
    
    const freeRowsLimit = 500;
    const isExceeded = totalRows > freeRowsLimit;
    
    return {
      isExceeded,
      totalRows,
      freeRowsLimit
    };
  } catch (error) {
    console.error("Error checking free tier limit:", error);
    throw error;
  }
}

/**
 * Download CSV file from result_url
 */
export async function downloadCsvFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    return csvText;
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
}
