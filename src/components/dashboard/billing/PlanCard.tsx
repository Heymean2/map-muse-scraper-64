
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description?: string;
    price: number;
    is_recommended?: boolean;
  };
  isActive: boolean;
  onSelect: (planId: string) => void;
  features: PlanFeature[];
}

export function PlanCard({ plan, isActive, onSelect, features }: PlanCardProps) {
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
        </div>
        <CardDescription>{plan.description || ""}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${parseFloat(plan.price.toString()).toFixed(2)}</span>
          <span className="text-muted-foreground">/month</span>
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
          onClick={() => onSelect(plan.id)}
        >
          {isActive ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
