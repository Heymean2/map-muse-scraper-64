import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { TransactionReceipt } from "./TransactionReceipt";

interface Transaction {
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

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasRetried, setHasRetried] = useState(false);
  const transactionsPerPage = 5;

  const fetchTransactions = async (retrying = false) => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsError(true);
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
          setHasRetried(true);
          setTimeout(() => fetchTransactions(true), 1000);
        } else {
          setIsError(true);
          toast.error("Failed to load credit balance");
        }
        return;
      }
      
      if (profileData) {
        setCurrentCredits(profileData.credits || 0);
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
        setIsError(true);
        toast.error("Failed to load transactions");
        return;
      }
      
      if (!data || data.length === 0) {
        setTransactions([]);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }
      
      // Format the transactions and calculate running balance
      // Start with 0 and build up the balance chronologically
      let runningBalance = 0;
      const formattedTransactions = data.map((transaction: any) => {
        // Only add credits to the balance if the transaction is completed
        if (transaction.credits_purchased && transaction.status === 'completed') {
          runningBalance += transaction.credits_purchased;
        }
        
        const transObj = {
          id: transaction.id,
          amount: transaction.amount,
          payment_method: transaction.payment_method,
          status: transaction.status,
          transaction_date: transaction.transaction_date,
          plan_name: transaction.pricing_plans?.name || 'Credit Purchase',
          credits_purchased: transaction.credits_purchased,
          billing_period: transaction.billing_period,
          running_balance: runningBalance,
          payment_id: transaction.payment_id,
          receipt_url: transaction.receipt_url
        };
        
        return transObj;
      });
      
      // Reverse again to display newest first in the UI
      const reversedTransactions = [...formattedTransactions].reverse();
      setTransactions(reversedTransactions);
      setTotalPages(Math.max(1, Math.ceil(reversedTransactions.length / transactionsPerPage)));
      
    } catch (error) {
      console.error('Error in transaction history:', error);
      setIsError(true);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setHasRetried(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Get current page transactions
  const getCurrentPageTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return transactions.slice(startIndex, endIndex);
  };

  // Navigate between pages
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Enhanced receipt generator with better formatting
  const generateReceipt = (transaction: Transaction) => {
    // Better formatting with sections and clear indicator of transaction type
    const transactionType = transaction.credits_purchased 
      ? 'Credit Purchase' 
      : 'Subscription Payment';
      
    const receiptContent = `
----------------------------------------------
                RECEIPT
----------------------------------------------
Transaction ID: ${transaction.id}
Date: ${format(new Date(transaction.transaction_date), 'PPP')}
Transaction Type: ${transactionType}

----------------------------------------------
PAYMENT DETAILS
----------------------------------------------
Amount: $${transaction.amount.toFixed(2)} USD
Payment Method: ${transaction.payment_method === 'paypal' ? 'PayPal' : 'Credit Card'}
Status: ${transaction.status.toUpperCase()}

----------------------------------------------
TRANSACTION DETAILS
----------------------------------------------
${transaction.credits_purchased ? `Credits Added: ${transaction.credits_purchased}` : ''}
${transaction.plan_name ? `Plan: ${transaction.plan_name}` : ''}
${transaction.billing_period ? `Billing Period: ${transaction.billing_period}` : ''}

----------------------------------------------
ACCOUNT SUMMARY
----------------------------------------------
Credit Balance After Transaction: ${transaction.running_balance}

----------------------------------------------
    `.trim();
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${format(new Date(transaction.transaction_date), 'yyyy-MM-dd')}-${transaction.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Receipt downloaded successfully");
  };

  // Get status badge styling based on transaction status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      default:
        return 'Failed';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payments and credit changes</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchTransactions()} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="py-8 text-center">
            <p className="text-red-500 mb-2">Failed to load transaction history</p>
            <Button onClick={() => fetchTransactions(true)} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="mb-4 p-3 bg-slate-50 rounded-md border flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">Current Credit Balance:</span>
                <span className="text-2xl font-semibold ml-2">{currentCredits}</span>
              </div>
            </div>
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
                {getCurrentPageTransactions().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {transaction.credits_purchased ? (
                        <div className="flex items-center">
                          <span className="font-medium text-green-700">
                            {transaction.credits_purchased} Credits Purchase
                          </span>
                          <ArrowUp className="h-4 w-4 ml-1 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>{transaction.plan_name} Subscription</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.running_balance !== undefined ? 
                        transaction.running_balance : 
                        '-'}
                    </TableCell>
                    <TableCell className="text-center flex items-center justify-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => generateReceipt(transaction)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <TransactionReceipt 
                        receiptUrl={transaction.receipt_url} 
                        transactionId={transaction.id} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={handlePreviousPage} 
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <PaginationItem className="flex items-center">
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={handleNextPage} 
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            {isLoading ? (
              <p className="text-muted-foreground">Loading transactions...</p>
            ) : (
              <p className="text-muted-foreground">No transactions found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
