import { supabase } from "@/integrations/supabase/client";

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

/**
 * Gets an access token from PayPal API
 */
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }
  
  try {
    // Use sandbox URL for development, replace with production URL for production
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: "grant_type=client_credentials"
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal token error:", errorData);
      throw new Error("Failed to get PayPal access token");
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    console.error("Error getting PayPal access token:", error);
    throw new Error(`PayPal authentication failed: ${error.message}`);
  }
}

/**
 * Fetches order details from PayPal API
 */
async function fetchPayPalOrderDetails(
  orderId: string, 
  accessToken: string
): Promise<PayPalTransaction> {
  try {
    // Validate order ID format
    if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
      throw new Error("Invalid PayPal order ID");
    }
    
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PayPal API error (${response.status}):`, errorText);
      throw new Error(`PayPal API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate that we got a completed transaction
    if (!data || !data.purchase_units || data.purchase_units.length === 0) {
      throw new Error("Invalid transaction data received from PayPal");
    }
    
    const purchaseUnit = data.purchase_units[0];
    const paymentCapture = purchaseUnit.payments?.captures?.[0];
    
    if (!paymentCapture) {
      throw new Error("No payment capture found in PayPal transaction");
    }
    
    // Combine relevant data from order and capture into our transaction structure
    const transaction: PayPalTransaction = {
      id: paymentCapture.id, // Use capture ID as transaction ID
      status: data.status,
      amount: {
        value: purchaseUnit.amount.value,
        currency_code: purchaseUnit.amount.currency_code
      },
      payer: data.payer,
      links: paymentCapture.links || []
    };
    
    return transaction;
  } catch (error: any) {
    console.error("Error fetching PayPal transaction details:", error);
    throw new Error(`PayPal transaction fetch failed: ${error.message}`);
  }
}

/**
 * Extracts receipt URL from PayPal transaction details
 */
function extractReceiptUrl(transaction: PayPalTransaction): string | null {
  // Try to find a receipt link in the links array
  const receiptLink = transaction.links.find(link => 
    link.rel === 'receipt' || link.rel === 'self'
  );
  
  if (receiptLink) {
    return receiptLink.href;
  }
  
  // Fallback to a constructed URL based on the transaction ID
  if (transaction.id) {
    return `https://www.sandbox.paypal.com/activity/payment/${transaction.id}`;
  }
  
  return null;
}

/**
 * Updates transaction in our database with PayPal details
 */
async function updateTransactionInDatabase(
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
      const existingMetadata = existingTransaction.metadata || {};
      
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
