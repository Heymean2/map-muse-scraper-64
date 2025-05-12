
import { getPayPalAccessToken } from "./api/accessToken";
import { fetchPayPalOrderDetails } from "./api/orderDetails";
import { extractReceiptUrl } from "./utils/receiptUtils";
import { updateTransactionInDatabase } from "./database/updateTransaction";

/**
 * Type definitions for PayPal transaction data
 */
interface PayPalTransaction {
  id: string;
  status: string;
  amount: {
    value: string;
    currency_code: string;
  };
  payer: {
    email_address: string;
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

/**
 * Synchronizes transaction details from PayPal to our Supabase database
 * 
 * @param orderId The PayPal order ID to fetch transaction details for
 * @param userId The Supabase user ID associated with this transaction
 * @returns Promise with the updated transaction record or error
 */
export async function syncPayPalTransaction(orderId: string, userId: string) {
  console.log(`Starting PayPal transaction sync for order ${orderId}, user ${userId}`);
  
  try {
    // Step 1: Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Step 2: Fetch order details from PayPal
    const transactionDetails = await fetchPayPalOrderDetails(orderId, accessToken);
    
    if (!transactionDetails) {
      throw new Error(`Could not fetch transaction details for order ${orderId}`);
    }
    
    // Step 3: Get receipt URL (typically from links array)
    const receiptUrl = extractReceiptUrl(transactionDetails);
    
    // Step 4: Update the transaction in our database
    const updatedTransaction = await updateTransactionInDatabase(
      userId,
      orderId,
      {
        amount: parseFloat(transactionDetails.amount.value),
        currency: transactionDetails.amount.currency_code,
        status: transactionDetails.status.toLowerCase(),
        payerEmail: transactionDetails.payer.email_address,
        receiptUrl
      }
    );
    
    console.log(`Successfully synced PayPal transaction ${orderId} for user ${userId}`);
    return updatedTransaction;
    
  } catch (error: any) {
    console.error(`Error syncing PayPal transaction: ${error.message}`, error);
    throw error;
  }
}
