
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Check if user has access to requested features based on their plan
export async function checkPlanAccess(supabase: SupabaseClient, userId: string, fields: string[]) {
  try {
    // Check user's plan for access to advanced features
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan_id')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      // Continue with default plan if profile fetch fails
      return { hasAccess: true };
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
      throw {
        status: 403,
        message: "Your current plan does not allow access to review data. Please upgrade to Pro."
      };
    }

    return { hasAccess: true };
  } catch (error) {
    if (error.status) throw error; // Re-throw our custom errors
    console.error("Error checking plan access:", error);
    throw {
      status: 500,
      message: "Failed to check plan access"
    };
  }
}
