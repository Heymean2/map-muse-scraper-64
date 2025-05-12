
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";

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
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(0);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }
      
      // Get user's current credits first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
        
      if (profileData) {
        setCurrentCredits(profileData.credits || 0);
      }
      
      const { data, error } = await supabase
        .from('billing_transactions')
        .select(`
          *,
          pricing_plans (name)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      
      // Format the transactions and calculate running balance
      let runningBalance = currentCredits;
      const formattedTransactions = data.map((transaction: any) => {
        const transObj = {
          id: transaction.id,
          amount: transaction.amount,
          payment_method: transaction.payment_method,
          status: transaction.status,
          transaction_date: transaction.transaction_date,
          plan_name: transaction.pricing_plans?.name || 'Credit Purchase',
          credits_purchased: transaction.credits_purchased,
          billing_period: transaction.billing_period,
          running_balance: runningBalance
        };
        
        // Adjust running balance by subtracting the credits purchased
        // for the next transaction (moving backwards in time)
        if (transaction.credits_purchased && transaction.status === 'completed') {
          runningBalance -= transaction.credits_purchased;
        }
        
        return transObj;
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to generate a receipt for a transaction - now with running credit balance
  const generateReceipt = (transaction: Transaction) => {
    const receiptContent = `
Receipt
-------
Transaction ID: ${transaction.id}
Date: ${format(new Date(transaction.transaction_date), 'PPP')}
Amount: $${transaction.amount.toFixed(2)}
Payment Method: ${transaction.payment_method === 'paypal' ? 'PayPal' : 'Credit Card'}
Status: ${transaction.status}
${transaction.credits_purchased ? `Credits Purchased: ${transaction.credits_purchased}` : ''}
${transaction.plan_name ? `Plan: ${transaction.plan_name}` : ''}
${transaction.billing_period ? `Billing Period: ${transaction.billing_period}` : ''}
${transaction.running_balance !== undefined ? `Credit Balance After Transaction: ${transaction.running_balance}` : ''}
    `.trim();
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent payments and subscription changes</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credit Balance</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.transaction_date), 'PP')}</TableCell>
                  <TableCell>
                    {transaction.credits_purchased 
                      ? `${transaction.credits_purchased} Credits Purchase` 
                      : `${transaction.plan_name} Subscription`}
                  </TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Completed' : 
                       transaction.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.running_balance !== undefined ? transaction.running_balance : '-'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => generateReceipt(transaction)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
