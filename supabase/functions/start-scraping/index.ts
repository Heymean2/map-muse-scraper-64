
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
    
    // Log key request information for debugging
    console.log(`Request method: ${req.method}`);
    console.log(`Auth header present: ${!!req.headers.get('Authorization')}`);
    console.log(`API key header present: ${!!req.headers.get('apikey')}`);
    
    // Log the first few characters of auth headers for debugging (don't log full tokens)
    const authHeader = req.headers.get('Authorization') || '';
    const apiKey = req.headers.get('apikey') || '';
    console.log(`Auth header preview: ${authHeader.substring(0, 15)}...`);
    console.log(`API key preview: ${apiKey.substring(0, 10)}...`);
    
    // Initialize Supabase client with user's JWT
    const supabase = getSupabaseClient(req);
    let user;

    try {
      // Authenticate user
      user = await authenticateUser(supabase);
      console.log("Authentication successful for user:", user.id);
    } catch (authError) {
      // Enhanced error logging for authentication failures
      console.error("Authentication error details:", JSON.stringify(authError, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: authError.message || "Authentication failed", 
          debug: authError.debug || { 
            auth_header_present: !!req.headers.get('Authorization'),
            auth_header_format: req.headers.get('Authorization')?.substring(0, 10) + '...',
            apikey_present: !!req.headers.get('apikey')
          }
        }),
        { 
          status: authError.status || 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
      
    // Get request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Received request data:", JSON.stringify(requestData, null, 2));
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
