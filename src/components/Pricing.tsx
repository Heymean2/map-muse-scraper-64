
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 29,
    description: "Perfect for individuals and small businesses just getting started.",
    features: [
      "Up to 500 business listings per month",
      "Export to CSV and Excel",
      "Basic search filters",
      "Email support",
      "1 user account"
    ],
    popular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    name: "Professional",
    price: 79,
    description: "Ideal for growing businesses with more data needs.",
    features: [
      "Up to 2,500 business listings per month",
      "All export formats",
      "Advanced filters and sorting",
      "Priority email support",
      "5 user accounts",
      "API access"
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large organizations requiring maximum data and features.",
    features: [
      "Unlimited business listings",
      "All export formats",
      "Premium filters and sorting",
      "24/7 priority support",
      "Unlimited user accounts",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager"
    ],
    popular: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`rounded-xl overflow-hidden transition-all duration-300 transform ${
                plan.popular 
                  ? 'shadow-lg ring-2 ring-accent scale-105 md:scale-105 z-10 bg-white' 
                  : 'shadow-soft hover:shadow-md bg-white'
              } ${withDelay(animationClasses.fadeIn, 300 + (index * 100))}`}
            >
              {plan.popular && (
                <div className="bg-accent text-white text-center py-2 text-sm font-medium">
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
                  className="w-full mb-6"
                >
                  {plan.buttonText}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-slate-500 mb-4">
            Need a custom plan? Contact our sales team for a tailored solution.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </Container>
    </section>
  );
}
