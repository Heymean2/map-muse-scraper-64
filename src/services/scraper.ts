import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Base URL for the scraper API
const BASE_URL = "https://localhost:4242";

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
  row_count: number | null;
  result_data?: any[]; // Adding result_data as an optional array property
}

// Type declaration for RPC functions
type RPCFunctions = {
  increment_rows: (args: { row_increment: number }) => Promise<number>;
}

/**
 * Check if user is eligible to start a new scraping task
 */
export async function checkScrapingEligibility(): Promise<{
  eligible: boolean;
  message?: string;
}> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        eligible: false,
        message: "You must be logged in to use this feature"
      };
    }
    
    // Get user plan information
    const userPlanInfo = await getUserPlanInfo();
    
    // If user is on a paid plan, they are eligible
    if (!userPlanInfo.isFreePlan) {
      return { eligible: true };
    }
    
    // Check if user has exceeded the free tier limit
    if (userPlanInfo.isExceeded) {
      return {
        eligible: false,
        message: `You've reached the free tier limit of ${userPlanInfo.freeRowsLimit} rows. Please upgrade your plan to continue scraping.`
      };
    }
    
    // User is eligible
    return { eligible: true };
  } catch (error) {
    console.error("Error checking scraping eligibility:", error);
    return {
      eligible: false,
      message: "Error checking eligibility. Please try again later."
    };
  }
}

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
        const userPlanInfo = await getUserPlanInfo();
        
        // Check if free tier is exceeded and limit data if necessary
        let isLimited = false;
        if (userPlanInfo.isFreePlan && userPlanInfo.totalRows > userPlanInfo.freeRowsLimit) {
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
          current_plan: userPlanInfo.planName
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
 * Get user's plan information and usage data
 */
export async function getUserPlanInfo(): Promise<{
  isFreePlan: boolean;
  planName: string;
  totalRows: number;
  freeRowsLimit: number;
  isExceeded: boolean;
  credits?: number;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get user profile with plan info
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_id, credits')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw profileError;
    }
    
    // Get plan details
    const { data: planData, error: planError } = await supabase
      .from('pricing_plans')
      .select('name, row_limit')
      .eq('id', profileData?.plan_id || 1)
      .single();
      
    if (planError) {
      console.error("Error fetching pricing plan:", planError);
      throw planError;
    }
    
    // Calculate total rows from all scraping requests
    const { data: scrapeData, error: scrapeError } = await supabase
      .from('scraping_requests')
      .select('row_count')
      .eq('user_id', user.id);
      
    if (scrapeError) {
      console.error("Error fetching scraping requests:", scrapeError);
      throw scrapeError;
    }
    
    // Sum up all row_count values
    const totalRows = scrapeData.reduce((sum, item) => {
      return sum + (Number(item.row_count) || 0);
    }, 0);
    
    // Default to Free Plan if no plan found
    const planName = planData?.name || 'Free Plan';
    const freeRowsLimit = planData?.row_limit || 500;
    const isFreePlan = planName === 'Free Plan';
    const isExceeded = isFreePlan && totalRows > freeRowsLimit;
    const credits = profileData?.credits || 0;
    
    return {
      isFreePlan,
      planName,
      totalRows,
      freeRowsLimit,
      isExceeded,
      credits
    };
  } catch (error) {
    console.error("Error checking user plan:", error);
    // Default to free plan with exceeded limit
    return {
      isFreePlan: true,
      planName: 'Free Plan',
      totalRows: 0,
      freeRowsLimit: 500,
      isExceeded: false,
      credits: 0
    };
  }
}

/**
 * Update total rows used by user
 */
export async function updateUserRows(rowCount: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Fix: Use a direct update instead of RPC
    const { error } = await supabase
      .from('profiles')
      .update({ total_rows: Number(rowCount) })
      .eq('id', user.id);
      
    if (error) {
      console.error("Error updating user rows:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error updating user row count:", error);
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

/**
 * Check if user has exceeded free tier limit (500 rows)
 * @deprecated Use getUserPlanInfo instead
 */
export async function checkUserFreeTierLimit(): Promise<{
  isExceeded: boolean;
  totalRows: number;
  freeRowsLimit: number;
}> {
  const planInfo = await getUserPlanInfo();
  
  return {
    isExceeded: planInfo.isExceeded,
    totalRows: planInfo.totalRows,
    freeRowsLimit: planInfo.freeRowsLimit
  };
}
