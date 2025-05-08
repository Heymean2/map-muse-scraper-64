
import { supabase } from "@/integrations/supabase/client";

/**
 * Update total rows used by user
 */
export async function updateUserRows(rowCount: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Fix: Convert current_rows to a number to make TypeScript happy
    const numericRowCount = Number(rowCount);
    
    // Fix: Use a direct update instead of RPC
    const { error } = await supabase
      .from('profiles')
      .update({ total_rows: numericRowCount })
      .eq('id', user.id);
      
    if (error) {
      console.error("Error updating user rows:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error updating user row count:", error);
  }
}

/**
 * Update user's credits
 */
export async function updateUserCredits(creditAmount: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required");
    }
    
    // Get current credits
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching user credits:", fetchError);
      throw fetchError;
    }
    
    const currentCredits = profileData?.credits || 0;
    const newCredits = currentCredits + creditAmount;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: Math.max(0, newCredits) })
      .eq('id', user.id);
      
    if (updateError) {
      console.error("Error updating user credits:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Error updating user credits:", error);
  }
}
