
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Check if user has access to requested features based on their plan
export async function checkPlanAccess(userId, fields, requestData) {
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
    
    // Extract plan type flags from request
    const useCreditPlan = requestData.useCreditPlan || isCreditPlan;
    const useSubscriptionPlan = requestData.useSubscriptionPlan || isSubscriptionPlan;
    const hasBothPlanTypes = requestData.hasBothPlanTypes || false;
    
    console.log("Plan flags from request:", {
      useCreditPlan,
      useSubscriptionPlan,
      hasBothPlanTypes
    });

    // Check if user has access to review data
    const hasReviewsAccess = isSubscriptionPlan || userCredits > 0 || planFeatures.reviews;
    if (fields.includes('reviews') && !hasReviewsAccess) {
      throw {
        status: 403,
        message: "Your current plan does not allow access to review data. Please upgrade to Pro or purchase credits."
      };
    }

    // For subscription plans, no need to check row limits
    if (useSubscriptionPlan) {
      console.log("Subscription plan detected - user has unlimited access");
      
      // If user has both plan types, log this information
      if (hasBothPlanTypes) {
        console.log("User has both subscription and credits. Using subscription plan.");
      }
      
      return { 
        hasAccess: true, 
        planType: 'subscription',
        hasBothPlanTypes
      };
    }

    // For credit-based plans, check if user has enough credits
    if (useCreditPlan) {
      console.log(`Credit-based plan detected. User has ${userCredits} credits`);
      if (userCredits <= 0) {
        throw {
          status: 403,
          message: "You don't have enough credits to perform this operation. Please purchase more credits."
        };
      }
      
      // For credit plans, the user has access as long as they have credits
      return { 
        hasAccess: true, 
        planType: 'credits',
        hasBothPlanTypes
      };
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
    return { 
      hasAccess: true, 
      planType: 'free',
      hasBothPlanTypes
    };
    
  } catch (error) {
    console.error("Error checking plan access:", error);
    if (error.status) throw error; // Re-throw our custom errors
    
    throw {
      status: 500,
      message: "Failed to check plan access"
    };
  }
}
