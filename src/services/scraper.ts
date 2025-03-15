
import { toast } from "sonner";

// Base URL for the scraper API
const BASE_URL = "https://loose-rings-add.loca.lt/scrape";

// User ID storage key
const USER_ID_KEY = "scraper_user_id";

export interface ScraperParams {
  keywords: string;
  country: string;
  states: string[];
  fields: string[];
  rating?: string;
}

export interface ScraperResponse {
  success: boolean;
  user_id: string;
  task_id?: string;
  message?: string;
  error?: string;
}

/**
 * Get or create a persistent user ID
 */
export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate a random user ID if none exists
    userId = "user_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

/**
 * Start a scraping task
 */
export async function startScraping(params: ScraperParams): Promise<ScraperResponse> {
  try {
    const userId = getUserId();
    
    // Build request body
    const requestData = {
      keywords: params.keywords,
      country: params.country,
      states: params.states.join(','),
      user_id: userId,
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
    
    return {
      success: true,
      user_id: userId,
      task_id: data.task_id,
      message: data.message || "Scraping started successfully"
    };
  } catch (error) {
    console.error("Error starting scraping:", error);
    toast.error("Failed to start scraping. Please try again.");
    
    return {
      success: false,
      user_id: getUserId(),
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Get the results of a scraping task
 */
export async function getScrapingResults(taskId?: string): Promise<any> {
  try {
    const userId = getUserId();
    
    // Construct the URL for getting results
    const url = `${BASE_URL}/results?user_id=${userId}${taskId ? `&task_id=${taskId}` : ''}`;
    
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
    return data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}
