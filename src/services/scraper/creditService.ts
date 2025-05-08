
import { supabase } from "@/integrations/supabase/client";
import { updateUserCredits } from "./userStatsService";

/**
 * Purchase credits
 */
export async function purchaseCredits(packageCount: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get credit package details
    const { data: packageData, error: packageError } = await supabase
      .from('pricing_plans')
      .select('credits')
      .eq('name', 'Credit Package')
      .single();
      
    if (packageError) {
      console.error("Error fetching credit package:", packageError);
      throw packageError;
    }
    
    const creditsPerPackage = packageData?.credits || 1000;
    const totalCredits = creditsPerPackage * packageCount;
    
    // In a real application, here we would process payment
    // For now, we'll just update the user's credits
    await updateUserCredits(totalCredits);
    
    return true;
  } catch (error) {
    console.error("Error purchasing credits:", error);
    return false;
  }
}
