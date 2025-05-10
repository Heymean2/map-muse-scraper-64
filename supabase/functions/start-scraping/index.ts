
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { authenticate } from "./auth.ts";
import { validateRequest } from "./validation.ts";
import { checkPlanAccess } from "./plan-checker.ts";
import { createScrapingTask } from "./task-manager.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function start-scraping received request");
    
    // Log headers for debugging (masking sensitive data)
    console.log("Request headers:", {
      authorization: req.headers.has('Authorization') ? 'Present (masked)' : 'Missing',
      apikey: req.headers.has('apikey') ? 'Present (masked)' : 'Missing',
      contentType: req.headers.get('Content-Type')
    });
    
    // Step 1: Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data:", JSON.stringify(requestData));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 2: Authenticate user
    let user;
    try {
      user = await authenticate(req);
      console.log("Authentication successful for user:", user.id);
    } catch (authError) {
      console.error("Authentication failed:", authError);
      return new Response(
        JSON.stringify({ success: false, error: authError.message || "Authentication failed" }),
        { status: authError.status || 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 3: Validate request parameters
    const { keywords, country, states, fields, rating } = requestData;
    try {
      await validateRequest({ keywords, country, states, fields });
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ success: false, error: validationError.message }),
        { status: validationError.status || 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 4: Check plan access
    try {
      await checkPlanAccess(user.id, fields);
    } catch (planError) {
      console.error("Plan access error:", planError);
      return new Response(
        JSON.stringify({ success: false, error: planError.message }),
        { status: planError.status || 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 5: Create scraping task
    try {
      const taskResult = await createScrapingTask({
        userId: user.id,
        keywords, 
        country, 
        states, 
        fields,
        rating
      });
      
      console.log("Task created successfully:", taskResult.taskId);
      
      // Return successful response with task ID
      return new Response(
        JSON.stringify({
          success: true,
          taskId: taskResult.taskId,
          message: "Scraping task started successfully"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (taskError) {
      console.error("Task creation error:", taskError);
      return new Response(
        JSON.stringify({ success: false, error: taskError.message || "Failed to create task" }),
        { status: taskError.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error in start-scraping function:', error);
    
    // Determine if this is a custom error with status
    const status = error.status || 500;
    const message = error.message || "An unexpected error occurred";
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: message
      }),
      { 
        status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
