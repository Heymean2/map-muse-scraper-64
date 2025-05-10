
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Check if user has access to requested features based on their plan
export async function checkPlanAccess(userId, fields) {
  try {
    console.log(`Checking plan access for user ${userId}`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase URL or service role key");
      throw {
        status: 500,
        message: "Server configuration error"
      };
    }
    
    // Create admin client with service role key for direct DB access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check user's plan for access to advanced features
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_id')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      // Continue with default free plan if profile fetch fails
      // This ensures users still get basic access if there's a DB issue
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
      } else if (planData) {
        // Ensure features is treated as an object
        planFeatures = typeof planData.features === 'object' ? 
          planData.features : 
          { reviews: false };
      }
    }

    // Check if user has access to review data
    if (fields.includes('reviews') && !planFeatures.reviews) {
      throw {
        status: 403,
        message: "Your current plan does not allow access to review data. Please upgrade to Pro."
      };
    }

    // Check if user has reached their plan's scraping task limit
    const { data: tasksCount, error: tasksError } = await supabase
      .from('scraping_requests')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    const count = tasksCount?.count || 0;
    
    // Get plan limit (default to 5 for free tier)
    const { data: planLimit, error: planLimitError } = await supabase
      .from('pricing_plans')
      .select('row_limit')
      .eq('id', profileData?.plan_id || 1)
      .single();
      
    const limit = planLimit?.row_limit || 5;
    
    if (count >= limit) {
      throw {
        status: 403,
        message: "You have reached your plan's limit for scraping tasks. Please upgrade your plan."
      };
    }

    console.log(`User ${userId} has access to the requested features`);
    return { hasAccess: true };
    
  } catch (error) {
    console.error("Error checking plan access:", error);
    if (error.status) throw error; // Re-throw our custom errors
    
    throw {
      status: 500,
      message: "Failed to check plan access"
    };
  }
}
