
import { PayPalTransaction } from "@/types/paypal";

/**
 * Fetches order details from PayPal API
 */
export async function fetchPayPalOrderDetails(
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
