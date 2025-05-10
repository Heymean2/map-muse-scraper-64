
import { Badge } from "@/components/ui/badge";
import { InfinityIcon } from "lucide-react";

interface ProfileDetailsProps {
  plan?: {
    name: string;
    billing_period?: string;
    price_per_credit?: number;
    row_limit?: number;
  };
  credits?: number;
  totalRows?: number;
  userId: string;
}

export function ProfileDetails({ plan, credits = 0, totalRows = 0, userId }: ProfileDetailsProps) {
  // Check if plan is credit-based
  const isCreditBased = plan?.billing_period === 'credits';
  // Check if plan is subscription-based (monthly and not free)
  const isSubscription = plan?.billing_period === 'monthly' && plan.row_limit > 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
      <div className="bg-muted/30 rounded-md p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Plan</h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{plan?.name || "Free Plan"}</p>
          {plan && (
            <Badge variant="outline" className={isCreditBased ? "bg-blue-50" : "bg-green-50"}>
              {isCreditBased ? "Pay-Per-Use" : "Subscription"}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-md p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Available Credits</h3>
        <p className="text-lg font-semibold">
          {isCreditBased ? credits : isSubscription ? "Unlimited" : credits}
          {isCreditBased && plan?.price_per_credit && (
            <span className="text-sm font-normal ml-2 text-muted-foreground">
              (${plan.price_per_credit.toFixed(3)}/credit)
            </span>
          )}
        </p>
      </div>
      
      <div className="bg-muted/30 rounded-md p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Data Rows Used</h3>
        <div className="flex items-center">
          {isSubscription ? (
            <>
              <p className="text-lg font-semibold mr-2">{totalRows}</p>
              <InfinityIcon className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <p className="text-lg font-semibold">
              {totalRows} / {plan?.row_limit || "∞"}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-md p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">User ID</h3>
        <p className="text-sm font-mono truncate">{userId}</p>
      </div>
    </div>
  );
}
