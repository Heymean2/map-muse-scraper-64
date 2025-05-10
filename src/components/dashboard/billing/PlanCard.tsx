
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, InfinityIcon } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanCardProps {
  plan: {
    id: string | number; // Updated to accept both string and number
    name: string;
    description?: string;
    price: number;
    is_recommended?: boolean;
    price_per_credit?: number;
    billing_period?: string;
  };
  isActive: boolean;
  onSelect: (planId: string) => void;
  features: PlanFeature[];
  planType?: "subscription" | "credits";
}

export function PlanCard({ plan, isActive, onSelect, features, planType = "subscription" }: PlanCardProps) {
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    if (isActive) return;
    
    // Redirect to checkout with plan data
    navigate(`/checkout?planId=${plan.id}&planType=${planType}`);
  };

  return (
    <Card 
      className={`${isActive ? 'border-primary bg-primary/5' : ''} ${plan.is_recommended ? 'border-accent' : ''} transition-all duration-200`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          {plan.is_recommended && (
            <Badge variant="outline" className="bg-accent text-accent-foreground">
              Recommended
            </Badge>
          )}
          {isActive && (
            <Badge variant="outline" className="bg-primary text-primary-foreground">
              Current Plan
            </Badge>
          )}
        </div>
        <CardDescription>{plan.description || ""}</CardDescription>
        <div className="mt-4">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold">${parseFloat(plan.price.toString()).toFixed(2)}</span>
            {planType === "subscription" && <span className="text-muted-foreground">/month</span>}
          </div>
          
          {plan.billing_period === "monthly" && plan.price > 0 && (
            <div className="flex items-center mt-1">
              <InfinityIcon className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-sm text-muted-foreground">Unlimited rows</span>
            </div>
          )}
          
          {plan.billing_period === "credits" && (
            <div className="text-sm text-muted-foreground mt-1">
              Pay only for what you use ({plan.price_per_credit?.toFixed(3) || "0.001"}/credit)
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-medium mb-2">Features:</h4>
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              {feature.included ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-slate-300 mr-2 flex-shrink-0" />
              )}
              <span className={!feature.included ? "text-slate-500" : ""}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isActive ? "outline" : "default"}
          disabled={isActive}
          onClick={handleSelectPlan}
        >
          {isActive ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
