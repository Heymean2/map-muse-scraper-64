
import { AlertCircle, InfinityIcon } from "lucide-react";
import { UserPlanInfo } from "@/services/scraper/types";

interface CombinedPlanInfoProps {
  userPlan: UserPlanInfo;
  formatPricePerCredit: (price?: number) => string;
}

export function CombinedPlanInfo({ userPlan, formatPricePerCredit }: CombinedPlanInfoProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">
              You have both plans activated
            </h3>
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              <p>
                Your subscription plan ({userPlan?.planName}) is currently active and provides unlimited access.
                You also have {userPlan?.credits} credits available that will be usable after your subscription expires.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium flex items-center">
            <InfinityIcon className="h-4 w-4 mr-1 text-green-500" />
            Active Subscription
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You currently have unlimited access to data extraction with your {userPlan?.planName}.
          </p>
          <div className="text-xs text-muted-foreground">
            Rows used: {userPlan?.totalRows?.toLocaleString() || 0}
          </div>
        </div>
        
        <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium">Credit Balance</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You have {userPlan?.credits} credits available for use after your subscription.
          </p>
          <div className="text-xs text-muted-foreground">
            $0.002 per credit
          </div>
        </div>
      </div>
    </div>
  );
}
