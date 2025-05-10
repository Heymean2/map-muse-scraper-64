
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserPlanInfo } from "@/services/scraper/types";
import { Progress } from "@/components/ui/progress";

interface CurrentPlanInfoProps {
  userPlan?: UserPlanInfo;
}

export function CurrentPlanInfo({ userPlan }: CurrentPlanInfoProps) {
  const navigate = useNavigate();
  
  // Check if the user is on a credit-based plan
  const isCreditBasedPlan = userPlan?.planName?.includes("Credit");
  
  return (
    <div className="mt-8 bg-slate-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">Current Plan</h3>
        {userPlan?.planName && <Badge>{userPlan.planName}</Badge>}
      </div>
      
      {isCreditBasedPlan ? (
        <div className="space-y-4">
          <p className="text-slate-600">
            You are using the pay-per-use credit system. Each row extracted costs 1 credit.
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available Credits:</span>
              <span className="font-medium">{userPlan?.credits?.toLocaleString() || 0}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Price per Credit:</span>
              <span className="font-medium">${userPlan?.price_per_credit?.toFixed(3) || 0.001}</span>
            </div>
          </div>
          
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
              Buy More Credits
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-slate-600">
            {userPlan?.planName ? (
              userPlan.isFreePlan ? (
                `You are on the Free plan with limited access to ${userPlan.freeRowsLimit} rows.`
              ) : (
                `You are on the ${userPlan.planName} with unlimited access to data extraction.`
              )
            ) : (
              "You are currently on the Free plan with limited access to our features."
            )}
          </p>
          
          {userPlan?.isFreePlan && userPlan.freeRowsLimit && (
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
          )}
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => navigate('/dashboard/scrape')}
            >
              <span>Start Scraping</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
