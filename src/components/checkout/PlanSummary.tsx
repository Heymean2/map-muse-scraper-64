
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, CalendarClock } from "lucide-react";

interface PlanSummaryProps {
  selectedPlan: any;
  customCredits?: number;
  creditPrice?: number;
}

export function PlanSummary({ selectedPlan, customCredits, creditPrice }: PlanSummaryProps) {
  if (!selectedPlan) {
    return null;
  }

  // Determine if we're viewing a credit plan based on plan type or URL parameters
  const isCreditPlan = selectedPlan.billing_period === 'credits' || 
                      (window.location.search.includes('planType=credits'));
  
  const features = [
    "Unlimited data extractions",
    "Export to CSV and Excel",
    "Email support",
    "API access (Pro plans)",
  ];
  
  // Calculate the price for credit plans with custom amounts
  const calculateTotal = () => {
    if (isCreditPlan && customCredits) {
      // Use the price per credit from the plan if available, otherwise fall back to provided creditPrice
      const pricePerCredit = selectedPlan.price_per_credit || creditPrice || 0.00299;
      return (customCredits * pricePerCredit).toFixed(2);
    }
    return selectedPlan.price?.toFixed(2) || "0.00";
  };

  // Get the actual price per credit to display
  const getPricePerCredit = () => {
    // Use the price from the plan object first, then fallback to prop, then hardcoded value
    return selectedPlan.price_per_credit || creditPrice || 0.00299;
  };

  // Format price per credit with proper precision (5 decimal places)
  const formatPricePerCredit = (price: number) => {
    // Ensure we display at least 3 decimal places and up to 5 if needed
    return price.toFixed(5).replace(/0+$/, '').replace(/\.$/, '.00');
  };

  return (
    <Card className="conversion-card border-slate-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-violet-primary">
          {isCreditPlan ? (
            <>
              <CreditCard className="h-5 w-5" />
              <span>Credit Package</span>
            </>
          ) : (
            <>
              <CalendarClock className="h-5 w-5" />
              <span>{selectedPlan.name}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="text-3xl font-bold text-violet-primary">${calculateTotal()}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {isCreditPlan
              ? `$${formatPricePerCredit(getPricePerCredit())} per credit × ${customCredits?.toLocaleString() || ""} credits`
              : `Billed ${selectedPlan.billing_period}`}
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-violet-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <Check className="h-3 w-3 text-violet-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          {isCreditPlan ? (
            <>
              <CreditCard className="h-3 w-3" />
              Credits never expire
            </>
          ) : (
            <>
              <CalendarClock className="h-3 w-3" />
              Cancel anytime
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
