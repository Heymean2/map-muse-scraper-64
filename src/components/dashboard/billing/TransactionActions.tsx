
import { FileText, Download } from "lucide-react";
import { Transaction } from "./types/transaction";
import { InvoiceButton } from "./InvoiceButton";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TransactionActionsProps {
  transaction: Transaction;
}

export function TransactionActions({ transaction }: TransactionActionsProps) {
  const hasCreditsPurchased = transaction.credits_purchased && transaction.credits_purchased > 0;
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <InvoiceButton
        transactionId={transaction.id}
      />
      
      {hasCreditsPurchased && transaction.receipt_url && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(transaction.receipt_url, '_blank')}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Receipt</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
