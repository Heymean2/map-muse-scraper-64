
import { format } from "date-fns";
import { Transaction } from "../types/transaction";
import { toast } from "sonner";

// Get status badge styling based on transaction status
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-red-100 text-red-800';
  }
};

// Get status display text
export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'pending':
      return 'Pending';
    default:
      return 'Failed';
  }
};

// Generate receipt text content for download
export const generateReceiptContent = (transaction: Transaction) => {
  // Better formatting with sections and clear indicator of transaction type
  const transactionType = transaction.credits_purchased 
    ? 'Credit Purchase' 
    : 'Subscription Payment';
    
  return `
----------------------------------------------
                RECEIPT
----------------------------------------------
Transaction ID: ${transaction.id}
Date: ${format(new Date(transaction.transaction_date), 'PPP')}
Transaction Type: ${transactionType}

----------------------------------------------
PAYMENT DETAILS
----------------------------------------------
Amount: $${transaction.amount.toFixed(2)} USD
Payment Method: ${transaction.payment_method === 'paypal' ? 'PayPal' : 'Credit Card'}
Status: ${transaction.status.toUpperCase()}

----------------------------------------------
TRANSACTION DETAILS
----------------------------------------------
${transaction.credits_purchased ? `Credits Added: ${transaction.credits_purchased}` : ''}
${transaction.plan_name ? `Plan: ${transaction.plan_name}` : ''}
${transaction.billing_period ? `Billing Period: ${transaction.billing_period}` : ''}

----------------------------------------------
ACCOUNT SUMMARY
----------------------------------------------
Credit Balance After Transaction: ${transaction.running_balance}

----------------------------------------------
  `.trim();
};

// Generate and download receipt file
export const downloadReceipt = (transaction: Transaction) => {
  const receiptContent = generateReceiptContent(transaction);
  
  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${format(new Date(transaction.transaction_date), 'yyyy-MM-dd')}-${transaction.id.substring(0, 8)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.success("Receipt downloaded successfully");
};
