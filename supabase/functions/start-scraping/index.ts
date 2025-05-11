
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
      console.log("Request data:", JSON.stringify({
        ...requestData,
        hasBothPlanTypes: requestData.hasBothPlanTypes,
        useCreditPlan: requestData.useCreditPlan,
        useSubscriptionPlan: requestData.useSubscriptionPlan,
        taskId: requestData.taskId // Log the client-provided task ID
      }));
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
    const { taskId, keywords, country, states, fields, rating } = requestData;
    try {
      await validateRequest({ keywords, country, states, fields });
      
      // Additionally validate taskId format - it should be a valid UUID string
      if (!taskId || typeof taskId !== 'string' || !taskId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        throw {
          status: 400,
          message: "Invalid task ID format - must be a valid UUID"
        };
      }
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ success: false, error: validationError.message }),
        { status: validationError.status || 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 4: Check plan access with plan type information
    try {
      const accessDetails = await checkPlanAccess(user.id, fields, requestData);
      console.log("Plan access details:", accessDetails);
      
      // Add plan type info to the request data
      requestData.planType = accessDetails.planType;
      requestData.hasBothPlanTypes = accessDetails.hasBothPlanTypes;
    } catch (planError) {
      console.error("Plan access error:", planError);
      return new Response(
        JSON.stringify({ success: false, error: planError.message }),
        { status: planError.status || 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Step 5: Create scraping task with plan information and client-provided task ID
    try {
      const taskResult = await createScrapingTask({
        userId: user.id,
        taskId: requestData.taskId, // Pass the client-provided UUID
        keywords, 
        country, 
        states, 
        fields,
        rating,
        planType: requestData.planType || 'free',
        hasBothPlanTypes: requestData.hasBothPlanTypes || false
      });
      
      console.log("Task created successfully with ID:", taskResult.taskId);
      
      // Return successful response with task ID 
      return new Response(
        JSON.stringify({
          success: true,
          taskId: taskResult.taskId, // Return the ID as primary identifier
          message: "Scraping task started successfully",
          planType: requestData.planType || 'free',
          hasBothPlanTypes: requestData.hasBothPlanTypes || false
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
