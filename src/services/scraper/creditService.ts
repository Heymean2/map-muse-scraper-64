
import { supabase } from "@/integrations/supabase/client";
import { updateUserCredits } from "./userStatsService";
import { toast } from "sonner";

/**
 * Purchase credits
 * @param packageCount Number of credit packages to purchase (1000 credits per package)
 */
export async function purchaseCredits(packageCount: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required");
      return false;
    }
    
    // Get credit package details
    const { data: packageData, error: packageError } = await supabase
      .from('pricing_plans')
      .select('credits, price_per_credit')
      .eq('billing_period', 'credits')
      .single();
      
    if (packageError) {
      console.error("Error fetching credit package:", packageError);
      throw packageError;
    }
    
    // Apply volume discount
    let discount = 0;
    if (packageCount >= 25) {
      discount = 0.15; // 15% discount
    } else if (packageCount >= 10) {
      discount = 0.10; // 10% discount
    } else if (packageCount >= 5) {
      discount = 0.05; // 5% discount
    }
    
    const creditsPerPackage = 1000;
    const totalCredits = creditsPerPackage * packageCount;
    const pricePerCredit = packageData?.price_per_credit || 0.001;
    
    // Calculate total price with discount
    const basePrice = totalCredits * pricePerCredit;
    const finalPrice = basePrice * (1 - discount);
    
    // In a real application, we would integrate with Stripe here
    // For now, we'll simulate a successful payment and update the user's credits
    
    // Update the user's profile with the new credit amount
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw profileError;
    }
    
    const currentCredits = profile?.credits || 0;
    const newCredits = currentCredits + totalCredits;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);
      
    if (updateError) {
      console.error("Error updating user credits:", updateError);
      throw updateError;
    }
    
    toast.success(`Successfully purchased ${totalCredits} credits for $${finalPrice.toFixed(2)}`);
    return true;
  } catch (error) {
    console.error("Error purchasing credits:", error);
    toast.error("Failed to purchase credits");
    return false;
  }
}
