
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Base URL for the scraper API
const BASE_URL = "https://loose-rings-add.loca.lt/scrape";

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
    
    // Build request body
    const requestData: {
      keywords: string;
      country: string;
      states: string;
      user_id: string;
      fields: string;
      rating?: string;
    } = {
      keywords: params.keywords,
      country: params.country,
      states: params.states.join(','),
      user_id: user.id,
      fields: params.fields.join(',')
    };
    
    // Add optional rating parameter
    if (params.rating) {
      requestData.rating = params.rating;
    }
    
    // Make the API request
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Scraping started:", data);
    
    // Save record to Supabase
    const { error: insertError } = await supabase
      .from('user_csv_files')
      .insert({
        user_id: user.id,
        task_id: data.task_id,
        filename: `${params.keywords}_${new Date().toISOString()}`,
        keywords: params.keywords,
        country: params.country,
        states: params.states.join(','),
        fields: params.fields.join(','),
        rating: params.rating,
        status: 'processing'
      });
      
    if (insertError) {
      console.error("Error saving to Supabase:", insertError);
    }
    
    return {
      success: true,
      user_id: user.id,
      task_id: data.task_id,
      message: data.message || "Scraping started successfully"
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
      // Get specific task results
      // First check if we already have results in Supabase
      const { data: existingData, error: fetchError } = await supabase
        .from('user_csv_files')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .single();
      
      if (existingData && existingData.status !== 'processing' && existingData.result_data) {
        return {
          data: existingData.result_data,
          status: existingData.status,
          search_info: {
            keywords: existingData.keywords,
            location: `${existingData.country} - ${existingData.states}`,
            fields: existingData.fields
          },
          total_count: existingData.result_data?.length || 0
        };
      }
    }
    
    // If no results in database or still processing, fetch from API
    // Construct the URL for getting results
    const url = `${BASE_URL}/results?user_id=${user.id}${taskId ? `&task_id=${taskId}` : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If we have results and a task ID, update the record in Supabase
    if (data.data && data.data.length > 0 && taskId) {
      const { error: updateError } = await supabase
        .from('user_csv_files')
        .update({
          status: 'completed',
          result_data: data.data
        })
        .eq('user_id', user.id)
        .eq('task_id', taskId);
        
      if (updateError) {
        console.error("Error updating Supabase record:", updateError);
      }
    }
    
    return data;
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
      .from('user_csv_files')
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
