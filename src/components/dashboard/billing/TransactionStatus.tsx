
import { getStatusBadge, getStatusText } from "./utils/transactionDisplayUtils";

interface TransactionStatusProps {
  status: string;
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  return (
    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(status)}`}>
      {getStatusText(status)}
    </span>
  );
}
