import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface PlanActionsProps {
  navigate: (path: string) => void;
  isCreditBasedPlan: boolean;
  hasCredits: boolean;
}

export function PlanActions({ navigate, isCreditBasedPlan, hasCredits }: PlanActionsProps) {
  const location = useLocation();
  const isOnBillingPage = location.pathname === "/dashboard/billing";
  
  // Hide the "Buy More Credits" button if user is already on the billing page
  // and has either a credit-based plan or additional credits
  const shouldShowCreditButton = !(isOnBillingPage && (isCreditBasedPlan || hasCredits));
  
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
      
      {shouldShowCreditButton && (
        <Button
          variant="default" 
          size="sm"
          onClick={() => {
            // If we're already on the billing page, scroll to the credit section
            // Otherwise navigate to the billing page
            if (isOnBillingPage) {
              // Find the credit tab and click it
              const creditTabElement = document.querySelector('[value="credits"]');
              if (creditTabElement instanceof HTMLElement) {
                creditTabElement.click();
              }
            } else {
              navigate('/dashboard/billing');
              // We'll set the activeTab to "credits" when the page loads
              sessionStorage.setItem('billing_active_tab', 'credits');
            }
          }}
        >
          {isCreditBasedPlan || hasCredits ? "Buy More Credits" : "Manage Plan"}
        </Button>
      )}
    </div>
  );
}
