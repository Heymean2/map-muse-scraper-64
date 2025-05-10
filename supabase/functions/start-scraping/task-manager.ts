
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Generate a unique task ID
function generateTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new scraping request record
export async function createScrapingTask({
  userId, 
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
    
    // Generate unique task ID
    const taskId = generateTaskId();
    console.log(`Creating scraping task with ID ${taskId} for user ${userId} using plan type: ${planType}`);
    
    // Format fields for storage
    const formattedStates = Array.isArray(states) ? states.join(',') : states;
    const formattedFields = Array.isArray(fields) ? fields.join(',') : fields;
    
    // Add plan type metadata for the task
    const taskMetadata = {
      planType,
      hasBothPlanTypes
    };
    
    // Insert new scraping request
    const { error: insertError } = await supabase
      .from('scraping_requests')
      .insert({
        task_id: taskId,
        user_id: userId,
        keywords,
        country,
        states: formattedStates,
        fields: formattedFields,
        rating,
        status: 'processing',
        metadata: taskMetadata,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error creating scraping task:', insertError.message);
      
      // Handle specific errors
      if (insertError.message && insertError.message.includes('plan limit')) {
        throw {
          status: 403,
          message: "You have reached your plan's limit for scraping tasks. Please upgrade your plan."
        };
      }

      throw {
        status: 500,
        message: insertError.message || "Failed to create scraping task"
      };
    }

    console.log(`Scraping task ${taskId} created successfully using plan type: ${planType}`);
    return { success: true, taskId, planType };
    
  } catch (error) {
    console.error('Database error:', error);
    if (error.status) throw error; // Re-throw our custom errors
    
    throw {
      status: 500,
      message: error.message || "Database error"
    };
  }
}
