
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionDescription } from "./TransactionDescription";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./TransactionActions";
import { Transaction } from "./types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right font-medium">Credit Balance</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="whitespace-nowrap">
              {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <TransactionDescription 
                credits_purchased={transaction.credits_purchased}
                plan_name={transaction.plan_name}
              />
            </TableCell>
            <TableCell className="text-right font-medium">
              ${transaction.amount.toFixed(2)}
            </TableCell>
            <TableCell>
              <TransactionStatus status={transaction.status} />
            </TableCell>
            <TableCell className="text-right font-medium">
              {transaction.running_balance !== undefined ? 
                transaction.running_balance : 
                '-'}
            </TableCell>
            <TableCell className="text-center">
              <TransactionActions transaction={transaction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
