
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/services/paypal/generateInvoice";
import { toast } from "sonner";

interface InvoiceButtonProps {
  transactionId: string;
}

export function InvoiceButton({ transactionId }: InvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle invoice generation and download
  const handleInvoice = async () => {
    try {
      setIsLoading(true);
      
      // Generate and get the invoice URL
      const invoiceUrl = await generateInvoice(transactionId);
      
      if (invoiceUrl) {
        // Open the invoice in a new tab
        window.open(invoiceUrl, '_blank');
      }
    } catch (error) {
      console.error("Error handling invoice:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center gap-1 text-xs"
      onClick={handleInvoice}
      disabled={isLoading}
      title="Generate invoice PDF"
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <FileText className="h-3 w-3" />
      )}
      <span>Invoice</span>
    </Button>
  );
}
