
import { useState } from "react";
import { ExternalLink, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { syncReceipt } from "@/services/paypal/syncReceipt";
import { toast } from "sonner";

interface TransactionReceiptProps {
  receiptUrl?: string | null;
  transactionId: string;
}

export function TransactionReceipt({ receiptUrl, transactionId }: TransactionReceiptProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle receipt download or view
  const handleReceipt = async () => {
    try {
      setIsLoading(true);
      
      // Try to sync and get the receipt
      const receiptUrl = await syncReceipt(transactionId);
      
      if (receiptUrl) {
        // Open the receipt in a new tab
        window.open(receiptUrl, '_blank');
      }
    } catch (error) {
      console.error("Error handling receipt:", error);
      toast.error("Failed to retrieve receipt");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!receiptUrl) {
    return null;
  }
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center gap-1 text-xs"
      onClick={handleReceipt}
      disabled={isLoading}
      title="Download transaction receipt"
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <FileDown className="h-3 w-3" />
      )}
      <span>Receipt</span>
    </Button>
  );
}
