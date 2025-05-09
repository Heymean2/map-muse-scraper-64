
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
    
    // Log request method and headers for debugging
    console.log(`Request method: ${req.method}`);
    console.log(`Authorization header present: ${!!req.headers.get('Authorization')}`);
    console.log(`API key header present: ${!!req.headers.get('apikey')}`);
    
    // Initialize Supabase client
    const supabase = getSupabaseClient(req);
    
    // Authenticate user - this now gets a user directly from the token
    let user;
    try {
      user = await authenticateUser(req);
      console.log("User authenticated successfully:", user.id);
    } catch (authError) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: authError.message || "Authentication failed"
        }),
        { 
          status: authError.status || 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
      
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
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
    try {
      await checkPlanAccess(supabase, user.id, fields);
      console.log("Plan access check passed");
    } catch (accessError) {
      console.error("Plan access error:", accessError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: accessError.message || "Plan access error" 
        }),
        { 
          status: accessError.status || 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate a unique task ID
    const taskId = generateTaskId();
    console.log("Generated task ID:", taskId);

    // Create scraping request record
    try {
      await createScrapingRequest(supabase, user.id, taskId, { 
        keywords, country, states, fields, rating 
      });
      console.log("Scraping request created successfully");
    } catch (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: dbError.message || "Database error" 
        }),
        { 
          status: dbError.status || 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return successful response with task ID
    console.log("Returning successful response");
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

  } catch (error) {
    console.error('Unexpected error in start-scraping function:', error);
    
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
