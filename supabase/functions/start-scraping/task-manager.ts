
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Generate a unique task ID
export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new scraping request record
export async function createScrapingRequest(
  supabase: SupabaseClient,
  userId: string,
  taskId: string,
  { keywords, country, states, fields, rating }: { 
    keywords: string;
    country: string;
    states: string[];
    fields: string[];
    rating?: string;
  }
) {
  try {
    const { error: insertError } = await supabase
      .from('scraping_requests')
      .insert({
        task_id: taskId,
        user_id: userId,
        keywords,
        country,
        states: Array.isArray(states) ? states.join(',') : states,
        fields: Array.isArray(fields) ? fields.join(',') : fields,
        rating,
        status: 'processing',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting scraping request:', insertError.message);
      
      // Handle plan limit exceeded error specifically
      if (insertError.message && insertError.message.includes('plan limit')) {
        throw {
          status: 403,
          message: "You have reached your plan's limit for scraping tasks. Please upgrade your plan."
        };
      }

      throw {
        status: 500,
        message: insertError.message
      };
    }

    console.log(`Scraping task ${taskId} created for user ${userId}`);
    return { success: true };
  } catch (error) {
    if (error.status) throw error; // Re-throw our custom errors
    console.error('Database error:', error.message);
    throw {
      status: 500,
      message: error.message || "Database error"
    };
  }
}
