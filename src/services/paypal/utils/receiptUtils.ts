
import { PayPalTransaction } from "@/types/paypal";

/**
 * Extracts receipt URL from PayPal transaction details
 */
export function extractReceiptUrl(transaction: PayPalTransaction): string | null {
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
