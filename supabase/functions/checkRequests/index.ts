
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
    const { data: request, error: queryError } = await supabase
      .from('scraping_requests')
      .select('id, task_id, user_id')
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
    
    console.log(`Processing request ${request.task_id} for user ${request.user_id}`);
    
    // POST to backend endpoint
    const backendResponse = await fetch(`${backendBaseUrl}/check_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: request.user_id, 
        task_id: request.task_id 
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
        console.error(`Error updating request ${request.task_id}: ${updateError.message}`);
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log(`Successfully processed request ${request.task_id}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Request ${request.task_id} processed successfully`,
          user_id: request.user_id,
          task_id: request.task_id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } else {
      const errorText = await backendResponse.text();
      console.error(`Backend request failed for ${request.task_id}: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Backend returned ${backendResponse.status}: ${errorText}`,
          task_id: request.task_id
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
