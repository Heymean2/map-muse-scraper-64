
import { FileText } from "lucide-react";
import { Transaction } from "./types/transaction";
import { InvoiceButton } from "./InvoiceButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TransactionActionsProps {
  transaction: Transaction;
}

export function TransactionActions({ transaction }: TransactionActionsProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <InvoiceButton
        transactionId={transaction.id}
      />
    </div>
  );
}
