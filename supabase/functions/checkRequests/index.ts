
// Follow Deno's ES modules convention
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

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
    
    // Query for processing requests, ordered by created_at desc to get most recent first
    const { data: requests, error: queryError } = await supabase
      .from('scraping_requests')
      .select('id, task_id, user_id')
      .eq('status', 'processing')
      .order('created_at', { ascending: false })
      .limit(10); // Process in batches to avoid timeout
    
    if (queryError) {
      throw new Error(`Error querying requests: ${queryError.message}`);
    }
    
    console.log(`Found ${requests?.length || 0} processing requests`);
    
    // If no requests, return early
    if (!requests || requests.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No processing requests found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    // Process each request
    const results = await Promise.all(
      requests.map(async (request) => {
        try {
          const { id, task_id, user_id } = request;
          
          console.log(`Processing request ${task_id} for user ${user_id}`);
          
          // POST to backend endpoint
          const backendResponse = await fetch(`${backendBaseUrl}/check_request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              user_id, 
              task_id 
            }),
          });
          
          // Check if POST request was successful
          if (backendResponse.ok) {
            // Update request status to 'sent'
            const { error: updateError } = await supabase
              .from('scraping_requests')
              .update({ status: 'sent' })
              .eq('id', id);
            
            if (updateError) {
              console.error(`Error updating request ${task_id}: ${updateError.message}`);
              return { task_id, success: false, error: updateError.message };
            }
            
            console.log(`Successfully processed request ${task_id}`);
            return { task_id, success: true };
          } else {
            const errorText = await backendResponse.text();
            console.error(`Backend request failed for ${task_id}: ${errorText}`);
            return { task_id, success: false, error: `Backend returned ${backendResponse.status}: ${errorText}` };
          }
        } catch (error) {
          console.error(`Error processing request: ${error.message}`);
          return { success: false, error: error.message };
        }
      })
    );
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error(`Function error: ${error.message}`);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
