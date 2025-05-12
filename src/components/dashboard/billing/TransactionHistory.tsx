
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CreditBalanceDisplay } from "./CreditBalanceDisplay";
import { TransactionTable } from "./TransactionTable";
import { useTransactionHistory } from "./hooks/useTransactionHistory";

export function TransactionHistory() {
  const { 
    isLoading, 
    isError, 
    currentCredits, 
    currentPage, 
    totalPages, 
    transactions,
    fetchTransactions, 
    getCurrentPageTransactions, 
    handlePreviousPage, 
    handleNextPage 
  } = useTransactionHistory();

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
            <CreditBalanceDisplay currentCredits={currentCredits} />
            <TransactionTable transactions={getCurrentPageTransactions()} />
            
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
