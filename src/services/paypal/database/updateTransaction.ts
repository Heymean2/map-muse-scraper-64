
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates transaction in our database with PayPal details
 */
export async function updateTransactionInDatabase(
  userId: string,
  orderId: string,
  details: {
    amount: number;
    currency: string;
    status: string;
    payerEmail: string;
    receiptUrl: string | null;
  }
) {
  try {
    // First, try to find an existing transaction by order ID
    // This assumes we've stored the PayPal order ID in the payment_id column
    const { data: existingTransaction, error: findError } = await supabase
      .from('billing_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('payment_id', orderId)
      .maybeSingle();
      
    if (findError) {
      console.error("Error finding transaction:", findError);
      throw new Error(`Database query failed: ${findError.message}`);
    }
    
    if (existingTransaction) {
      // Update existing transaction
      // Ensure metadata is an object before spreading
      let existingMetadata = {};
      
      // Check if metadata exists and is an object
      if (existingTransaction.metadata && 
          typeof existingTransaction.metadata === 'object' && 
          existingTransaction.metadata !== null) {
        existingMetadata = existingTransaction.metadata;
      }
      
      const { data, error } = await supabase
        .from('billing_transactions')
        .update({
          amount: details.amount,
          currency: details.currency,
          status: details.status,
          payment_id: orderId,
          receipt_url: details.receiptUrl,
          metadata: {
            ...existingMetadata,
            payer_email: details.payerEmail,
            synced_at: new Date().toISOString()
          }
        })
        .eq('id', existingTransaction.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating transaction:", error);
        throw new Error(`Failed to update transaction: ${error.message}`);
      }
      
      return data;
    } else {
      // This block would handle the case where we need to create a new transaction
      // But in our case, the transaction should already exist from the captureOrder function
      console.warn(`Transaction not found for user ${userId} and order ${orderId}`);
      throw new Error("Transaction not found in database");
    }
  } catch (error: any) {
    console.error("Database error:", error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
}
