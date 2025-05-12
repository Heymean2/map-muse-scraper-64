
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-[120px]">Amount</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="text-right w-[140px]">Credit Balance</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="whitespace-nowrap">
                {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="max-w-[200px]">
                <TransactionDescription 
                  credits_purchased={transaction.credits_purchased}
                  plan_name={transaction.plan_name}
                />
              </TableCell>
              <TableCell className="text-right font-medium whitespace-nowrap">
                ${transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <TransactionStatus status={transaction.status} />
              </TableCell>
              <TableCell className="text-right font-medium whitespace-nowrap">
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
    </div>
  );
}
