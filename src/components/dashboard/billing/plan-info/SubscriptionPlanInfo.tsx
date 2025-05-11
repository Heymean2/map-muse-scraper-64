
import { InfinityIcon } from "lucide-react";
import { UserPlanInfo } from "@/services/scraper/types";

interface SubscriptionPlanInfoProps {
  userPlan: UserPlanInfo;
}

export function SubscriptionPlanInfo({ userPlan }: SubscriptionPlanInfoProps) {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 dark:text-slate-300">
        You are on the {userPlan?.planName} subscription with unlimited access to data extraction.
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <InfinityIcon className="h-4 w-4 mr-1 text-green-500" />
          <span>Unlimited rows with your subscription</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Rows used so far: {userPlan?.totalRows?.toLocaleString() || 0}
        </div>
      </div>
    </div>
  );
}
