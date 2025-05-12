
import { FileText } from "lucide-react";
import { Transaction } from "./types/transaction";
import { InvoiceButton } from "./InvoiceButton";

interface TransactionActionsProps {
  transaction: Transaction;
}

export function TransactionActions({ transaction }: TransactionActionsProps) {
  return (
    <div className="flex items-center justify-center">
      <InvoiceButton
        transactionId={transaction.id}
      />
    </div>
  );
}
