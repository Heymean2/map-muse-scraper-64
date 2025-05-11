
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";

interface PlanCardProps {
  plan: {
    name: string;
    price: number;
    description: string;
    features: string[];
    popular: boolean;
    buttonText: string;
    buttonVariant: "outline" | "default";
    billing_period: string;
  };
  index: number;
}

export function PlanCard({ plan, index }: PlanCardProps) {
  return (
    <div 
      key={plan.name}
      className={`relative ${withDelay(animationClasses.fadeIn, 300 + (index * 100))}`}
    >
      <Card
        className={`h-full rounded-xl overflow-hidden transition-all duration-500 transform ${
          plan.popular 
            ? 'shadow-lg ring-2 ring-accent shadow-accent/10 scale-105 md:scale-105 z-10 hover:shadow-xl hover:shadow-accent/20' 
            : 'shadow-soft hover:shadow-md hover:-translate-y-1'
        }`}
      >
        {plan.popular && (
          <div className="bg-red-500 text-white text-center py-2 text-sm font-medium">
            Most Popular
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <div className="flex items-baseline mb-4">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-slate-500 ml-2">/month</span>
          </div>
          
          <p className="text-slate-600 mb-6">{plan.description}</p>
          
          <Button 
            variant={plan.buttonVariant} 
            className={`w-full mb-6 ${plan.popular ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
          >
            {plan.buttonText}
          </Button>
          
          <div className="space-y-3">
            {plan.features.map((feature, idx) => (
              <div key={`${plan.name}-feature-${idx}`} className="flex items-start group">
                <div className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5">
                  <Check className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
                <span className="ml-3 text-slate-600 group-hover:text-slate-900 transition-colors">
                  {feature.replace(/and Excel|Excel and |Excel/g, '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
