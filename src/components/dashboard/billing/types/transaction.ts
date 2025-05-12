
export interface Transaction {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_date: string;
  plan_name?: string;
  credits_purchased?: number;
  billing_period?: string;
  running_balance?: number;
  payment_id?: string;
  receipt_url?: string;
}

export interface TransactionHistoryState {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  currentCredits: number;
  currentPage: number;
  totalPages: number;
  hasRetried: boolean;
}
