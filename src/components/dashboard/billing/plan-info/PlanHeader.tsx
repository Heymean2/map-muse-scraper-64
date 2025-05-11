
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { UserPlanInfo } from "@/services/scraper/types";

interface PlanHeaderProps {
  userPlan: UserPlanInfo;
  isCreditBasedPlan: boolean;
  handleRefresh: () => void;
  isRefreshing: boolean;
}

export function PlanHeader({ userPlan, isCreditBasedPlan, handleRefresh, isRefreshing }: PlanHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Current Plan</h3>
        {userPlan?.planName && <Badge>{userPlan.planName}</Badge>}
        {userPlan?.billing_period && (
          <Badge variant="outline" className={isCreditBasedPlan ? "bg-blue-50 dark:bg-blue-950/30" : "bg-green-50 dark:bg-green-950/30"}>
            {isCreditBasedPlan ? "Pay-Per-Use" : "Subscription"}
          </Badge>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
