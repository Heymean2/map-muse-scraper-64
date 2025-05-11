
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Update an existing scraping request record
export async function updateScrapingTask({
  userId, 
  taskId, 
  keywords, 
  country, 
  states, 
  fields,
  rating,
  planType = 'free',
  hasBothPlanTypes = false
}) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase URL or service role key");
      throw {
        status: 500,
        message: "Server configuration error"
      };
    }
    
    // Create admin client with service role key for direct DB access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log(`Updating scraping task ${taskId} for user ${userId} using plan type: ${planType}`);
    
    // Add plan type metadata for the task
    const taskMetadata = {
      planType,
      hasBothPlanTypes
    };
    
    // Update the existing scraping request
    const { data, error: updateError } = await supabase
      .from('scraping_requests')
      .update({
        status: 'processing',
        metadata: taskMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating scraping task:', updateError.message);
      
      // Handle specific errors
      if (updateError.message && updateError.message.includes('plan limit')) {
        throw {
          status: 403,
          message: "You have reached your plan's limit for scraping tasks. Please upgrade your plan."
        };
      }

      throw {
        status: 500,
        message: updateError.message || "Failed to update task"
      };
    }

    if (!data) {
      throw {
        status: 404,
        message: "Task not found. It may have been deleted or you don't have access to it."
      };
    }

    console.log(`Scraping task ${taskId} updated successfully using plan type: ${planType}`);
    return { 
      success: true,
      taskId,
      planType 
    };
    
  } catch (error) {
    console.error('Database error:', error);
    if (error.status) throw error; // Re-throw our custom errors
    
    throw {
      status: 500,
      message: error.message || "Database error"
    };
  }
}
