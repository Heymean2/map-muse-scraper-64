
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { getSupabaseClient, authenticateUser } from "./auth.ts";
import { validateScrapingParams } from "./validation.ts";
import { checkPlanAccess } from "./plan-checker.ts";
import { generateTaskId, createScrapingRequest } from "./task-manager.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function start-scraping received request");
    
    // Log all headers for debugging (redacting sensitive info)
    console.log("--- REQUEST HEADERS ---");
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() === 'authorization') {
        console.log(`${key}: ${value.substring(0, 15)}...`);
      } else if (key.toLowerCase() === 'apikey') {
        console.log(`${key}: [REDACTED]`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log("---------------------");
    
    // Initialize Supabase client with user's JWT
    const supabase = getSupabaseClient(req);

    try {
      // Authenticate user
      const user = await authenticateUser(supabase);
      
      // Get request body
      let requestData;
      try {
        requestData = await req.json();
        console.log("Request body received");
      } catch (e) {
        console.error("Failed to parse request body:", e);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid request body" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      const { keywords, country, states, fields, rating } = requestData;
      console.log("Processing request for keywords:", keywords);

      // Validate parameters
      const validation = validateScrapingParams({ keywords, country, states, fields });
      if (!validation.isValid) {
        console.error("Validation failed:", validation.error);
        return new Response(
          JSON.stringify({ success: false, error: validation.error }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check user's plan access
      await checkPlanAccess(supabase, user.id, fields);

      // Generate a unique task ID
      const taskId = generateTaskId();
      console.log("Generated task ID:", taskId);

      // Create scraping request record
      await createScrapingRequest(supabase, user.id, taskId, { 
        keywords, country, states, fields, rating 
      });

      // Return successful response with task ID
      return new Response(
        JSON.stringify({
          success: true,
          taskId,
          message: "Scraping task started successfully"
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (authError) {
      // Handle authentication and authorization errors
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: authError.message, 
          debug: authError.debug || { has_auth_header: !!req.headers.get('Authorization') }
        }),
        { 
          status: authError.status || 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error: any) {
    console.error('Error in start-scraping function:', error.message || error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
