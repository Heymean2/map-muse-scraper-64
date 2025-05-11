
import { UserPlanInfo } from "@/services/scraper/types";

interface CreditPlanInfoProps {
  userPlan: UserPlanInfo;
  formatPricePerCredit: (price?: number) => string;
}

export function CreditPlanInfo({ userPlan, formatPricePerCredit }: CreditPlanInfoProps) {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 dark:text-slate-300">
        You are using the pay-per-use credit system. Each row extracted costs 1 credit.
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Available Credits:</span>
          <span className="font-medium">{userPlan?.credits?.toLocaleString() || 0}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Price per Credit:</span>
          <span className="font-medium">${formatPricePerCredit(userPlan?.price_per_credit)}</span>
        </div>
      </div>
    </div>
  );
}
