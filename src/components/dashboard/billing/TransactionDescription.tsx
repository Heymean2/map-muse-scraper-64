
import { ArrowUp, CreditCard } from "lucide-react";

interface TransactionDescriptionProps {
  credits_purchased?: number | null;
  plan_name?: string;
}

export function TransactionDescription({ credits_purchased, plan_name }: TransactionDescriptionProps) {
  if (credits_purchased && credits_purchased > 0) {
    return (
      <div className="flex items-center">
        <CreditCard className="h-4 w-4 mr-1 text-google-blue" />
        <span className="font-medium text-google-blue">
          {credits_purchased.toLocaleString()} Credits
        </span>
        <ArrowUp className="h-4 w-4 ml-1 text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <span>{plan_name || "Subscription"}</span>
    </div>
  );
}
