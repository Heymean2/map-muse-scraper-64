
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PlanSummaryProps {
  selectedPlan: any;
  customCredits?: number;
  creditPrice?: number;
}

export function PlanSummary({ selectedPlan, customCredits, creditPrice }: PlanSummaryProps) {
  if (!selectedPlan) {
    return null;
  }

  const isCreditPlan = selectedPlan.billing_period === 'credits';
  const features = [
    "Unlimited data extractions",
    "Export to CSV and Excel",
    "Email support",
    "API access (Pro plans)",
  ];
  
  // Calculate the price for credit plans with custom amounts
  const calculateTotal = () => {
    if (isCreditPlan && customCredits && creditPrice) {
      return (customCredits * creditPrice).toFixed(2);
    }
    return selectedPlan.price?.toFixed(2) || "0.00";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle>
          {isCreditPlan && customCredits 
            ? `${customCredits.toLocaleString()} Credits` 
            : selectedPlan.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="text-2xl font-bold">${calculateTotal()}</div>
          <div className="text-sm text-muted-foreground">
            {isCreditPlan
              ? `$${selectedPlan.price_per_credit?.toFixed(3) || "0.00"} per credit`
              : `Billed ${selectedPlan.billing_period}`}
          </div>
        </div>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-4 w-4 text-primary mr-2 mt-1" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
        <div className="text-xs text-muted-foreground">
          {isCreditPlan 
            ? "Credits never expire" 
            : "Cancel anytime"}
        </div>
      </CardFooter>
    </Card>
  );
}
