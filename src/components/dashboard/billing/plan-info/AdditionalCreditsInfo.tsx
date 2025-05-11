
import { UserPlanInfo } from "@/services/scraper/types";

interface AdditionalCreditsInfoProps {
  userPlan: UserPlanInfo;
  hasBothPlanTypes: boolean;
}

export function AdditionalCreditsInfo({ userPlan, hasBothPlanTypes }: AdditionalCreditsInfoProps) {
  return (
    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
      <h4 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">Credits Available</h4>
      <p className="text-sm text-blue-600 dark:text-blue-400">
        You have {userPlan.credits} credits that will be usable after your subscription.
      </p>
    </div>
  );
}
