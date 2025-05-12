
export interface Transaction {
  id: string;
  user_id: string;
  plan_id: number | null;
  amount: number;
  transaction_date: string;
  credits_purchased: number | null;
  metadata?: Record<string, any>;
  currency: string;
  status: string;
  payment_method: string;
  payment_id: string | null;
  billing_period: string | null;
  plan_name?: string;
  receipt_url?: string | null;
  receipt_file_path?: string | null;
  invoice_file_path?: string | null;
  running_balance?: number;
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
