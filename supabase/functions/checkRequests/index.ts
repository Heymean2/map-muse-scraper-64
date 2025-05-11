
// Follow Deno's ES modules convention
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Handler function for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkRequests function execution");
    
    // Get env variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const backendBaseUrl = Deno.env.get('BACKEND_BASE_URL');
    
    // Validate required environment variables
    if (!supabaseUrl || !supabaseServiceKey || !backendBaseUrl) {
      throw new Error("Missing required environment variables");
    }
    
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the single most recent processing request
    // Now query using the UUID fields with fallback to text fields for backward compatibility
    const { data: request, error: queryError } = await supabase
      .from('scraping_requests')
      .select('id, task_id, task_id_uuid, user_id, user_id_uuid')
      .eq('status', 'processing')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (queryError) {
      if (queryError.code === 'PGRST116') {
        // This is the "no rows returned" error code
        return new Response(
          JSON.stringify({ success: true, message: "No processing requests found" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
      throw new Error(`Error querying requests: ${queryError.message}`);
    }
    
    // Use UUID values if available, otherwise fall back to text values
    const taskId = request.task_id_uuid || request.task_id;
    const userId = request.user_id_uuid || request.user_id;
    
    console.log(`Processing request ${taskId} for user ${userId}`);
    
    // POST to backend endpoint
    const backendResponse = await fetch(`${backendBaseUrl}/check_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: userId, 
        task_id: taskId 
      }),
    });
    
    // Check if POST request was successful
    if (backendResponse.ok) {
      // Update request status to 'sent'
      const { error: updateError } = await supabase
        .from('scraping_requests')
        .update({ status: 'sent' })
        .eq('id', request.id);
      
      if (updateError) {
        console.error(`Error updating request ${taskId}: ${updateError.message}`);
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log(`Successfully processed request ${taskId}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Request ${taskId} processed successfully`,
          user_id: userId,
          task_id: taskId
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      const errorText = await backendResponse.text();
      console.error(`Backend request failed for ${taskId}: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Backend returned ${backendResponse.status}: ${errorText}`,
          task_id: taskId
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error(`Function error: ${error.message}`);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
