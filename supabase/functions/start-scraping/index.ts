
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create a Supabase client with the user's JWT
function getSupabaseClient(req: Request): SupabaseClient {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  const apikey = req.headers.get('apikey') || '';

  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    {
      global: {
        headers: {
          Authorization: authorization,
          apikey,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}

// Function to validate scraping request parameters
function validateScrapingParams(params: any): { isValid: boolean; error?: string } {
  if (!params.keywords) {
    return { isValid: false, error: "Keywords are required" };
  }

  if (!params.country) {
    return { isValid: false, error: "Country is required" };
  }

  if (!params.states || !Array.isArray(params.states) || params.states.length === 0) {
    return { isValid: false, error: "At least one state is required" };
  }

  if (!params.fields || !Array.isArray(params.fields) || params.fields.length === 0) {
    return { isValid: false, error: "At least one field is required" };
  }

  return { isValid: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function start-scraping received request");
    
    // Log headers (without sensitive information)
    const headers = Array.from(req.headers.entries())
      .filter(([key]) => !key.toLowerCase().includes('authorization') && !key.toLowerCase().includes('apikey'))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    console.log("Request headers:", JSON.stringify(headers));
    
    // Initialize Supabase client with user's JWT
    const supabase = getSupabaseClient(req);

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Auth error:", userError.message);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Authentication error: " + userError.message
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!user) {
      console.error("No user found in JWT");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Unauthorized. Please sign in to use this feature." 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log("User authenticated:", user.id);

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

    // Check user's plan for access to advanced features
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_id')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      // Continue with default plan if profile fetch fails
    }

    let planFeatures = { reviews: false };
    if (profileData?.plan_id) {
      const { data: planData, error: planError } = await supabase
        .from('pricing_plans')
        .select('features')
        .eq('id', profileData.plan_id)
        .single();
      
      if (planError) {
        console.error("Error fetching plan:", planError.message);
      } else {
        planFeatures = planData?.features || { reviews: false };
      }
    }

    // Check if user has access to review data
    if (fields.includes('reviews') && !planFeatures.reviews) {
      return new Response(
        JSON.stringify({
          success: false, 
          error: "Your current plan does not allow access to review data. Please upgrade to Pro."
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate a unique task ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log("Generated task ID:", taskId);

    // Create scraping request record
    try {
      const { error: insertError } = await supabase
        .from('scraping_requests')
        .insert({
          task_id: taskId,
          user_id: user.id,
          keywords,
          country,
          states: Array.isArray(states) ? states.join(',') : states,
          fields: Array.isArray(fields) ? fields.join(',') : fields,
          rating,
          status: 'processing',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting scraping request:', insertError.message);
        
        // Handle plan limit exceeded error specifically
        if (insertError.message && insertError.message.includes('plan limit')) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "You have reached your plan's limit for scraping tasks. Please upgrade your plan." 
            }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ success: false, error: insertError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      return new Response(
        JSON.stringify({ success: false, error: dbError.message || "Database error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // In a real implementation, this would trigger the actual scraping process
    console.log(`Scraping task ${taskId} created for user ${user.id}`);

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
