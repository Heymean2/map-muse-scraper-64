
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
        toast.success("Invoice opened successfully");
      } else {
        toast.error("Failed to generate invoice");
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
      onClick={handleInvoice}
      disabled={isLoading}
      className="flex items-center gap-1 px-3"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      <span>Invoice</span>
    </Button>
  );
}
