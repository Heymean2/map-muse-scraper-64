
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
      .select('plan_id, credits')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      // Continue with default free plan if profile fetch fails
      // This ensures users still get basic access if there's a DB issue
    }

    let planFeatures = { reviews: false };
    let isPaidPlan = false;
    let isCreditPlan = false;
    let isSubscriptionPlan = false;
    let userCredits = profileData?.credits || 0;
    
    if (profileData?.plan_id) {
      const { data: planData, error: planError } = await supabase
        .from('pricing_plans')
        .select('features, billing_period, name, row_limit')
        .eq('id', profileData.plan_id)
        .single();
      
      if (planError) {
        console.error("Error fetching plan:", planError.message);
      } else if (planData) {
        // Ensure features is treated as an object
        planFeatures = typeof planData.features === 'object' ? 
          planData.features : 
          { reviews: false };
          
        // Check plan type
        isPaidPlan = !planData.name.toLowerCase().includes('free');
        isCreditPlan = planData.billing_period === 'credits';
        isSubscriptionPlan = planData.billing_period === 'monthly' && isPaidPlan;
        
        console.log(`User is on ${planData.name} plan (${planData.billing_period})`);
        console.log(`isPaid: ${isPaidPlan}, isCredit: ${isCreditPlan}, isSubscription: ${isSubscriptionPlan}`);
      }
    }

    // Check if user has access to review data
    if (fields.includes('reviews') && !planFeatures.reviews && !isCreditPlan) {
      throw {
        status: 403,
        message: "Your current plan does not allow access to review data. Please upgrade to Pro."
      };
    }

    // For credit-based plans, check if user has enough credits
    if (isCreditPlan) {
      console.log(`Credit-based plan detected. User has ${userCredits} credits`);
      if (userCredits <= 0) {
        throw {
          status: 403,
          message: "You don't have enough credits to perform this operation. Please purchase more credits."
        };
      }
      
      // For credit plans, the user has access as long as they have credits
      return { hasAccess: true, planType: 'credits' };
    }

    // For subscription plans, no need to check row limits
    if (isSubscriptionPlan) {
      console.log("Subscription plan detected - user has unlimited access");
      return { hasAccess: true, planType: 'subscription' };
    }

    // For free plans, check if user has reached their plan's scraping task limit
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
    return { hasAccess: true, planType: 'free' };
    
  } catch (error) {
    console.error("Error checking plan access:", error);
    if (error.status) throw error; // Re-throw our custom errors
    
    throw {
      status: 500,
      message: "Failed to check plan access"
    };
  }
}
