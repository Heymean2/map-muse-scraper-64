
import { Card } from "@/components/ui/card";

interface CreditBalanceDisplayProps {
  currentCredits: number;
}

export function CreditBalanceDisplay({ currentCredits }: CreditBalanceDisplayProps) {
  return (
    <div className="mb-4 p-3 bg-slate-50 rounded-md border flex justify-between items-center">
      <div>
        <span className="text-sm text-muted-foreground">Current Credit Balance:</span>
        <span className="text-2xl font-semibold ml-2">{currentCredits}</span>
      </div>
    </div>
  );
}
