
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionReceipt } from "./TransactionReceipt";
import { Transaction } from "./types/transaction";
import { downloadReceipt } from "./utils/transactionDisplayUtils";
import { InvoiceButton } from "./InvoiceButton";

interface TransactionActionsProps {
  transaction: Transaction;
}

export function TransactionActions({ transaction }: TransactionActionsProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => downloadReceipt(transaction)}
      >
        <Download className="h-4 w-4" />
      </Button>
      
      <TransactionReceipt 
        receiptUrl={transaction.receipt_url} 
        transactionId={transaction.id} 
      />
      
      <InvoiceButton
        transactionId={transaction.id}
      />
    </div>
  );
}
