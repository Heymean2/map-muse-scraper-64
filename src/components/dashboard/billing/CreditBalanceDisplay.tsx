
import { Card } from "@/components/ui/card";
import { ArrowUpCircle } from "lucide-react";

interface CreditBalanceDisplayProps {
  currentCredits: number;
}

export function CreditBalanceDisplay({ currentCredits }: CreditBalanceDisplayProps) {
  return (
    <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
      <div>
        <span className="text-sm text-muted-foreground">Current Credit Balance:</span>
        <span className="text-2xl font-bold ml-2 text-google-blue">{currentCredits.toLocaleString()}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <ArrowUpCircle className="h-4 w-4 mr-1 text-google-green" />
        <span>Based on transaction history</span>
      </div>
    </div>
  );
}
