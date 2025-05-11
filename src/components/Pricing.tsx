
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";
import { Check, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlanSelection } from "@/hooks/usePlanSelection";

export default function Pricing() {
  const { plansData, plansLoading } = usePlanSelection();
  
  // Default plans to use if data is still loading or empty
  const defaultPlans = [
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
      buttonVariant: "outline" as const,
      billing_period: "monthly"
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
      buttonVariant: "default" as const,
      billing_period: "monthly"
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
      buttonVariant: "outline" as const,
      billing_period: "monthly"
    },
    {
      name: "Pay as You Go",
      price: 0,
      description: "Perfect for one-time projects or occasional use.",
      price_per_credit: 0.03,
      features: [
        "Pay only for what you use",
        "0.03¢ per business listing",
        "All export formats",
        "Basic search filters",
        "Email support"
      ],
      popular: false,
      buttonText: "Buy Credits",
      buttonVariant: "outline" as const,
      billing_period: "credits"
    }
  ];

  // Helper function to safely transform features from the database
  const getFeaturesList = (features: any): string[] => {
    if (!features) return [];
    
    // If features is already an array, return it
    if (Array.isArray(features)) return features;
    
    // If features is an object, transform it to an array of strings
    if (typeof features === 'object') {
      const featuresList = [];
      
      // Add row limit feature if available
      if (features.unlimited_rows) {
        featuresList.push("Unlimited business listings");
      }
      
      // Add analytics feature if available
      if (features.analytics) {
        featuresList.push("Advanced analytics dashboard");
      }
      
      // Add API access feature if available
      if (features.api_access) {
        featuresList.push("API access");
      }
      
      // Add reviews data feature if available
      if (features.reviews_data) {
        featuresList.push("Customer reviews data");
      }
      
      // Add default features that all plans have
      featuresList.push(
        "Export to CSV and Excel",
        "Email support"
      );
      
      return featuresList;
    }
    
    return [];
  };

  // Use real data if available, otherwise use default plans
  const plans = plansData && plansData.length > 0 
    ? plansData.map(plan => ({
        name: plan.name,
        price: plan.price,
        description: `${plan.name} plan for business data extraction`,
        features: getFeaturesList(plan.features),
        popular: plan.is_recommended,
        buttonText: plan.is_recommended ? "Start Free Trial" : 
                   plan.billing_period === "credits" ? "Buy Credits" :
                   plan.price > 100 ? "Contact Sales" : "Get Started",
        buttonVariant: plan.is_recommended ? "default" as const : "outline" as const,
        billing_period: plan.billing_period || "monthly",
        price_per_credit: plan.price_per_credit || 0
      }))
    : defaultPlans;

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute -right-64 -top-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-64 -bottom-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <Container className="relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {plans.map((plan, index) => {
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
                    <div className="bg-accent text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      {plan.billing_period === "credits" ? (
                        <>
                          <span className="text-4xl font-bold">${plan.price_per_credit.toFixed(3)}</span>
                          <span className="text-slate-500 ml-2">/credit</span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-slate-500 ml-2">/month</span>
                        </>
                      )}
                    </div>
                    
                    {plan.billing_period === "credits" && (
                      <p className="text-xs text-accent mb-4">
                        Pay only for what you use
                      </p>
                    )}
                    
                    <p className="text-slate-600 mb-6">{plan.description}</p>
                    
                    <Button 
                      variant={plan.buttonVariant} 
                      className={`w-full mb-6 ${plan.popular ? 'bg-accent hover:bg-accent/90' : ''}`}
                    >
                      {plan.buttonText}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={`${plan.name}-feature-${idx}`} className="flex items-start group">
                          <div className="flex-shrink-0 h-5 w-5 text-accent mt-0.5">
                            <Check className="h-5 w-5 transition-transform group-hover:scale-110" />
                          </div>
                          <span className="ml-3 text-slate-600 group-hover:text-slate-900 transition-colors">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-slate-500 mb-4">
            Need a custom plan? Contact our sales team for a tailored solution.
          </p>
          <Button variant="outline" className="group">
            Contact Sales
            <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
          </Button>
        </div>
        
        <div className="mt-16 p-6 border border-slate-200 rounded-xl bg-white shadow-soft max-w-4xl mx-auto">
          <h3 className="text-xl font-medium text-center mb-6">What Our Customers Say</h3>
          <div className="italic text-center text-slate-600">
            "This tool has saved our marketing team countless hours of manual research. We've increased our lead generation by 230% in just two months."
            <div className="mt-4 font-medium text-slate-900">— Sarah Johnson, Marketing Director at TechGrowth Inc.</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
