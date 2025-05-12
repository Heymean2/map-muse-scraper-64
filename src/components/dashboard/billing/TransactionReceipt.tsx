
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionReceiptProps {
  receiptUrl?: string | null;
  transactionId: string;
}

export function TransactionReceipt({ receiptUrl, transactionId }: TransactionReceiptProps) {
  if (!receiptUrl) {
    return null;
  }
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center gap-1 text-xs"
      onClick={() => window.open(receiptUrl, '_blank')}
      title="View receipt on PayPal"
    >
      <ExternalLink className="h-3 w-3" />
      <span>Receipt</span>
    </Button>
  );
}
