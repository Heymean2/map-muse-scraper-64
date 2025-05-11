
import { Progress } from "@/components/ui/progress";
import { UserPlanInfo } from "@/services/scraper/types";

interface FreePlanInfoProps {
  userPlan: UserPlanInfo;
  hasCredits: boolean;
}

export function FreePlanInfo({ userPlan, hasCredits }: FreePlanInfoProps) {
  return (
    <div className="space-y-4">
      <p className="text-slate-600 dark:text-slate-300">
        You are on the Free plan with limited access to {userPlan.freeRowsLimit} rows.
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Rows Used:</span>
          <span className="font-medium">{userPlan.totalRows} / {userPlan.freeRowsLimit}</span>
        </div>
        <Progress 
          value={(userPlan.totalRows / userPlan.freeRowsLimit) * 100} 
          className="h-2"
        />
      </div>
      
      {/* Show credits even for free plan users */}
      {hasCredits && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h4 className="text-sm font-medium mb-1">Credits Available</h4>
          <p className="text-sm">{userPlan.credits} credits available for use</p>
        </div>
      )}
    </div>
  );
}
