
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Authenticate request
    const user = await authenticate(req);
    
    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    );
    
    // Get user's current plan from profiles table
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("plan_id")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user plan:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user plan" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ plan: profile.plan_id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in getCurrentPlan:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while fetching the current plan" 
      }),
      { 
        status: error.status || 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
