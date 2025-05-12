
import { ArrowUp } from "lucide-react";

interface TransactionDescriptionProps {
  credits_purchased?: number;
  plan_name?: string;
}

export function TransactionDescription({ credits_purchased, plan_name }: TransactionDescriptionProps) {
  if (credits_purchased) {
    return (
      <div className="flex items-center">
        <span className="font-medium text-green-700">
          {credits_purchased} Credits Purchase
        </span>
        <ArrowUp className="h-4 w-4 ml-1 text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <span>{plan_name} Subscription</span>
    </div>
  );
}
