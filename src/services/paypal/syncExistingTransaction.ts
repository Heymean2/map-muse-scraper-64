
import { supabase } from "@/integrations/supabase/client";
import { syncPayPalTransaction } from "./syncPayPalTransaction";
import { toast } from "sonner";

/**
 * Finds and syncs an existing transaction with PayPal
 * Can be used for manual syncing/reconciliation
 */
export async function syncExistingTransaction(transactionId: string) {
  try {
    // Find the transaction in our database
    const { data: transaction, error } = await supabase
      .from('billing_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
      
    if (error || !transaction) {
      console.error("Failed to find transaction:", error);
      toast.error("Transaction not found");
      return null;
    }
    
    // Check if we have a payment_id to sync with
    if (!transaction.payment_id) {
      toast.error("No PayPal payment ID found for this transaction");
      return null;
    }
    
    toast.info("Syncing transaction with PayPal...");
    
    // Call the sync function
    const updated = await syncPayPalTransaction(
      transaction.payment_id,
      transaction.user_id
    );
    
    toast.success("Transaction successfully synced with PayPal");
    return updated;
    
  } catch (error: any) {
    console.error("Error syncing transaction:", error);
    toast.error(`Sync failed: ${error.message}`);
    return null;
  }
}
