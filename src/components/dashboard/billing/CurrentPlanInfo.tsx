
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { UserPlanInfo } from "@/services/scraper/types";

// Import refactored components
import { PlanInfoSkeleton } from "./plan-info/PlanInfoSkeleton";
import { PlanHeader } from "./plan-info/PlanHeader";
import { SubscriptionPlanInfo } from "./plan-info/SubscriptionPlanInfo";
import { CreditPlanInfo } from "./plan-info/CreditPlanInfo";
import { AdditionalCreditsInfo } from "./plan-info/AdditionalCreditsInfo";
import { FreePlanInfo } from "./plan-info/FreePlanInfo";
import { CombinedPlanInfo } from "./plan-info/CombinedPlanInfo";
import { PlanActions } from "./plan-info/PlanActions";
import { usePlanInfoHelpers } from "./plan-info/usePlanInfoHelpers";

interface CurrentPlanInfoProps {
  userPlan?: UserPlanInfo;
}

export function CurrentPlanInfo({ userPlan }: CurrentPlanInfoProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { formatPricePerCredit } = usePlanInfoHelpers();
  
  // Check if the user is on a credit-based plan
  const isCreditBasedPlan = userPlan?.billing_period === 'credits';
  // Check if user is on a subscription plan (not free and not credit-based)
  const isSubscriptionPlan = userPlan?.billing_period === 'monthly' && !userPlan?.isFreePlan;
  // Check if user has both plan types
  const hasBothPlanTypes = userPlan?.hasBothPlanTypes;
  // Check if user has any credits (even if not on a credit plan)
  const hasCredits = (userPlan?.credits ?? 0) > 0;

  console.log("CurrentPlanInfo - userPlan:", userPlan);
  console.log("CurrentPlanInfo - plan types:", { isCreditBasedPlan, isSubscriptionPlan, hasBothPlanTypes, hasCredits });
  
  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['userPlanInfo'] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  // If no plan info is available yet
  if (!userPlan) {
    return <PlanInfoSkeleton handleRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }
  
  return (
    <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg">
      <PlanHeader 
        userPlan={userPlan} 
        isCreditBasedPlan={isCreditBasedPlan}
        handleRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <div className="space-y-6">
        {/* Subscription plan info */}
        {isSubscriptionPlan && (
          <SubscriptionPlanInfo userPlan={userPlan} />
        )}
        
        {/* Credit plan info */}
        {isCreditBasedPlan && (
          <CreditPlanInfo userPlan={userPlan} formatPricePerCredit={formatPricePerCredit} />
        )}
        
        {/* Show credit info for subscription users who also have credits */}
        {!isCreditBasedPlan && hasCredits && !hasBothPlanTypes && (
          <AdditionalCreditsInfo userPlan={userPlan} hasBothPlanTypes={hasBothPlanTypes} />
        )}
        
        {/* Free plan info */}
        {userPlan?.isFreePlan && !hasBothPlanTypes && (
          <FreePlanInfo userPlan={userPlan} hasCredits={hasCredits} />
        )}
        
        {/* Combined plan info - show when user has both subscription and credits */}
        {hasBothPlanTypes && (
          <CombinedPlanInfo userPlan={userPlan} formatPricePerCredit={formatPricePerCredit} />
        )}
        
        <PlanActions 
          navigate={navigate} 
          isCreditBasedPlan={isCreditBasedPlan}
          hasCredits={hasCredits}
        />
      </div>
    </div>
  );
}
