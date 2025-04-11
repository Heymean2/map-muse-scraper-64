
import { supabase } from "@/integrations/supabase/client";
import { ScraperParams, ScraperResponse, ScrapingRequest } from "./types";
import { BASE_URL } from "./config";
import { checkScrapingEligibility } from "./eligibility";
import { updateUserRows } from "./plans";
import { toast } from "sonner";

/**
 * Start a scraping task
 */
export async function startScraping(params: ScraperParams): Promise<ScraperResponse> {
  try {
    // First check if user is eligible
    const eligibility = await checkScrapingEligibility();
    
    if (!eligibility.eligible) {
      return {
        success: false,
        error: eligibility.message || "You are not eligible to start a new scraping task"
      };
    }
    
    // Get the current user's ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
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
        let totalCount = typedData.row_count || 0;
        
        if (typedData.result_data) {
          // Ensure result_data is an array
          dataArray = Array.isArray(typedData.result_data) 
            ? typedData.result_data 
            : [];
          
          // Use row_count from database if available, otherwise use length of result_data
          if (!totalCount) {
            totalCount = dataArray.length;
          }
        }
        
        // Get user plan and usage information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('plan_id, total_rows')
          .eq('id', user.id)
          .single();
          
        // Get plan information
        const { data: planData } = await supabase
          .from('pricing_plans')
          .select('name, row_limit')
          .eq('id', profileData?.plan_id || 1)
          .single();
          
        // Check if free tier is exceeded and limit data if necessary
        let isLimited = false;
        const isFreePlan = planData?.name === 'Free Plan';
        const freeRowsLimit = planData?.row_limit || 500;
        
        if (isFreePlan && (profileData?.total_rows || 0) > freeRowsLimit) {
          isLimited = true;
          // Only return the first 5 rows for preview
          if (dataArray.length > 5) {
            dataArray = dataArray.slice(0, 5);
          }
        }
        
        return {
          data: dataArray,
          status: typedData.status,
          search_info: {
            keywords: typedData.keywords,
            location: `${typedData.country} - ${typedData.states}`,
            fields: typedData.fields,
            rating: typedData.rating
          },
          total_count: totalCount,
          result_url: typedData.result_url,
          created_at: typedData.created_at,
          limited: isLimited,
          current_plan: planData?.name || 'Free Plan'
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
