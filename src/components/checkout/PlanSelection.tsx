
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PlanSelectionProps {
  plans: any[];
  selectedPlan: any;
  onSelectPlan: (plan: any) => void;
}

export function PlanSelection({ plans, selectedPlan, onSelectPlan }: PlanSelectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedPlan?.id === plan.id 
              ? 'border-primary bg-primary/5' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelectPlan(plan)}
        >
          <h3 className="font-medium">{plan.name}</h3>
          <div className="text-2xl font-bold my-2">
            ${plan.price}
            <span className="text-sm font-normal text-muted-foreground">
              /{plan.billing_period}
            </span>
          </div>
          {selectedPlan?.id === plan.id && (
            <div className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 inline-block mt-1">
              Selected
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
