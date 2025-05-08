
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserPlanInfo } from "@/services/scraper/types";

interface CurrentPlanInfoProps {
  userPlan?: UserPlanInfo;
}

export function CurrentPlanInfo({ userPlan }: CurrentPlanInfoProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mt-12 bg-slate-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">Current Plan</h3>
        {userPlan?.planName && <Badge>{userPlan.planName}</Badge>}
      </div>
      
      <p className="text-slate-600 mb-6">
        {userPlan?.planName ? (
          `You are currently on the ${userPlan.planName} plan with unlimited access to data extraction.`
        ) : (
          "You are currently on the Free plan with limited access to our features."
        )}
      </p>
      
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
  );
}
