
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction, TransactionHistoryState } from "../types/transaction";

export const useTransactionHistory = (transactionsPerPage = 5) => {
  const [state, setState] = useState<TransactionHistoryState>({
    transactions: [],
    isLoading: false,
    isError: false,
    currentCredits: 0,
    currentPage: 1,
    totalPages: 1,
    hasRetried: false,
  });

  // Fetch transactions from database
  const fetchTransactions = async (retrying = false) => {
    setState(prev => ({ ...prev, isLoading: true, isError: false }));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState(prev => ({ ...prev, isError: true }));
        toast.error("Authentication required");
        return;
      }
      
      // Fetch all transactions
      const { data, error } = await supabase
        .from('billing_transactions')
        .select(`
          *,
          pricing_plans (name)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false }); // Newest first
      
      if (error) {
        console.error('Error fetching transactions:', error);
        setState(prev => ({ ...prev, isError: true }));
        toast.error("Failed to load transactions");
        return;
      }
      
      if (!data || data.length === 0) {
        setState(prev => ({ 
          ...prev, 
          transactions: [], 
          totalPages: 1, 
          isLoading: false,
          currentCredits: 0
        }));
        return;
      }
      
      // Format the transactions
      const formattedTransactions: Transaction[] = data.map((transaction: any) => {
        return {
          id: transaction.id,
          user_id: transaction.user_id,
          plan_id: transaction.plan_id,
          amount: transaction.amount,
          payment_method: transaction.payment_method,
          status: transaction.status,
          transaction_date: transaction.transaction_date,
          plan_name: transaction.pricing_plans?.name || 'Credit Purchase',
          credits_purchased: transaction.credits_purchased || 0,
          billing_period: transaction.billing_period,
          payment_id: transaction.payment_id,
          receipt_url: transaction.receipt_url,
          currency: transaction.currency || 'USD',
          receipt_file_path: transaction.receipt_file_path,
          invoice_file_path: transaction.invoice_file_path
        };
      });
      
      // Get the current total credits by summing up all completed credit purchase transactions
      const totalAvailableCredits = formattedTransactions
        .filter(t => t.status === 'completed' && t.credits_purchased)
        .reduce((sum, transaction) => sum + (transaction.credits_purchased || 0), 0);
      
      setState(prev => ({
        ...prev,
        transactions: formattedTransactions,
        currentCredits: totalAvailableCredits,
        totalPages: Math.max(1, Math.ceil(formattedTransactions.length / transactionsPerPage)),
        isLoading: false,
        hasRetried: false
      }));
      
    } catch (error) {
      console.error('Error in transaction history:', error);
      setState(prev => ({ ...prev, isError: true, isLoading: false }));
      toast.error("An unexpected error occurred");
    }
  };

  // Get current page transactions
  const getCurrentPageTransactions = () => {
    const { transactions, currentPage } = state;
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return transactions.slice(startIndex, endIndex);
  };

  // Navigate between pages
  const handlePreviousPage = () => {
    if (state.currentPage > 1) {
      setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (state.currentPage < state.totalPages) {
      setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    ...state,
    fetchTransactions,
    getCurrentPageTransactions,
    handlePreviousPage,
    handleNextPage
  };
};
