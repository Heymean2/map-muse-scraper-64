
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, InfinityIcon, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserPlanInfo } from "@/services/scraper/types";
import { Progress } from "@/components/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface CurrentPlanInfoProps {
  userPlan?: UserPlanInfo;
}

export function CurrentPlanInfo({ userPlan }: CurrentPlanInfoProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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

  // Format price per credit with proper precision
  const formatPricePerCredit = (price?: number) => {
    if (!price || price < 0.001) return "0.00299";
    // Format with the right number of decimal places and remove trailing zeros
    return price.toFixed(5).replace(/0+$/, '').replace(/\.$/, '.00');
  };
  
  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['userPlanInfo'] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  // If no plan info is available yet
  if (!userPlan) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-center">
        <p className="text-muted-foreground">Loading plan information...</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg">
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
      
      <div className="space-y-6">
        {/* Subscription plan info */}
        {isSubscriptionPlan && (
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
        )}
        
        {/* Credit plan info */}
        {isCreditBasedPlan && (
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
        )}
        
        {/* Show credit info for subscription users who also have credits */}
        {!isCreditBasedPlan && hasCredits && !hasBothPlanTypes && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h4 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">Credits Available</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              You have {userPlan.credits} credits that will be usable after your subscription.
            </p>
          </div>
        )}
        
        {/* Free plan info */}
        {userPlan?.isFreePlan && !hasBothPlanTypes && (
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
        )}
        
        {/* Combined plan info - show when user has both subscription and credits */}
        {hasBothPlanTypes && (
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
                  ${formatPricePerCredit(userPlan?.price_per_credit)} per credit
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate('/dashboard/scrape')}
          >
            <span>Start Scraping</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default" 
            size="sm"
            onClick={() => navigate('/dashboard/billing')}
          >
            {isCreditBasedPlan || hasCredits ? "Buy More Credits" : "Manage Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
