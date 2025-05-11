
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanActionsProps {
  navigate: (path: string) => void;
  isCreditBasedPlan: boolean;
  hasCredits: boolean;
}

export function PlanActions({ navigate, isCreditBasedPlan, hasCredits }: PlanActionsProps) {
  return (
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
  );
}
