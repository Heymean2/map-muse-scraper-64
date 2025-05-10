
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
    const user = await authenticate(req);
    
    // Step 3: Validate request parameters
    const { keywords, country, states, fields, rating } = requestData;
    await validateRequest({ keywords, country, states, fields });
    
    // Step 4: Check plan access
    await checkPlanAccess(user.id, fields);
    
    // Step 5: Create scraping task
    const taskResult = await createScrapingTask({
      userId: user.id,
      keywords, 
      country, 
      states, 
      fields,
      rating
    });
    
    // Return successful response with task ID
    return new Response(
      JSON.stringify({
        success: true,
        taskId: taskResult.taskId,
        message: "Scraping task started successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in start-scraping function:', error);
    
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
