
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
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => downloadReceipt(transaction)}
        className="text-xs"
      >
        <Download className="h-3 w-3" />
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
