
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
      
      // Get user's current credits first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        if (!retrying) {
          // Auto-retry once
          setState(prev => ({ ...prev, hasRetried: true }));
          setTimeout(() => fetchTransactions(true), 1000);
        } else {
          setState(prev => ({ ...prev, isError: true }));
          toast.error("Failed to load credit balance");
        }
        return;
      }
      
      if (profileData) {
        setState(prev => ({ ...prev, currentCredits: profileData.credits || 0 }));
      }
      
      // Fetch all transactions
      const { data, error } = await supabase
        .from('billing_transactions')
        .select(`
          *,
          pricing_plans (name)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: true }); // Changed to chronological order (oldest first)
      
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
          isLoading: false 
        }));
        return;
      }
      
      // Format the transactions and calculate running balance
      // Start with 0 and build up the balance chronologically
      let runningBalance = 0;
      const formattedTransactions: Transaction[] = data.map((transaction: any) => {
        // Only add credits to the balance if the transaction is completed
        if (transaction.credits_purchased && transaction.status === 'completed') {
          runningBalance += transaction.credits_purchased;
        }
        
        return {
          id: transaction.id,
          user_id: transaction.user_id,
          plan_id: transaction.plan_id,
          amount: transaction.amount,
          payment_method: transaction.payment_method,
          status: transaction.status,
          transaction_date: transaction.transaction_date,
          plan_name: transaction.pricing_plans?.name || 'Credit Purchase',
          credits_purchased: transaction.credits_purchased,
          billing_period: transaction.billing_period,
          running_balance: runningBalance,
          payment_id: transaction.payment_id,
          receipt_url: transaction.receipt_url,
          currency: transaction.currency || 'USD',
          receipt_file_path: transaction.receipt_file_path,
          invoice_file_path: transaction.invoice_file_path
        };
      });
      
      // Reverse again to display newest first in the UI
      const reversedTransactions = [...formattedTransactions].reverse();
      
      setState(prev => ({
        ...prev,
        transactions: reversedTransactions,
        totalPages: Math.max(1, Math.ceil(reversedTransactions.length / transactionsPerPage)),
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
