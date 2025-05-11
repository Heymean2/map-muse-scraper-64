
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";
import { Check, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlanSelection } from "@/hooks/usePlanSelection";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Pricing() {
  const { plansData, plansLoading } = usePlanSelection();
  const [creditAmount, setCreditAmount] = useState(1000);
  const [estimatedCost, setEstimatedCost] = useState(2);
  const creditUnitPrice = 0.002; // $0.002 per credit

  // Calculate cost whenever credit amount changes
  useEffect(() => {
    setEstimatedCost(Number((creditAmount * creditUnitPrice).toFixed(2)));
  }, [creditAmount]);

  // Slider marker values for better UX
  const sliderMarkers = [500, 1000, 5000, 10000, 25000, 50000];

  // Default plans to use if data is still loading or empty
  const defaultPlans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for trying things out and small projects.",
      features: [
        "500 free credits to start",
        "Basic search filters",
        "Export to CSV",
        "Email support",
        "1 user account"
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      billing_period: "credits"
    },
    {
      name: "Basic",
      price: 29,
      description: "Perfect for individuals and small businesses just getting started.",
      features: [
        "Up to 25,000 business listings per month",
        "Export to CSV and Excel",
        "Basic search filters",
        "Standard support",
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
        "Unlimited business listings",
        "Advanced analytics dashboard",
        "All export formats",
        "Priority support",
        "3 user accounts"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      billing_period: "monthly"
    },
    {
      name: "Enterprise",
      price: 199,
      description: "For larger organizations requiring maximum data and features.",
      features: [
        "Unlimited business listings",
        "Advanced analytics dashboard",
        "Customer reviews data",
        "Custom integrations",
        "Dedicated account manager",
        "Unlimited user accounts"
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
      price_per_credit: creditUnitPrice,
      features: [
        "Pay only for what you use",
        `$${creditUnitPrice.toFixed(3)} per business listing`,
        "500 free credits to start",
        "All export formats",
        "Standard support"
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

  // Make sure credit plan is included
  const allPlans = [...plans];
  const hasCreditPlan = allPlans.some(plan => plan.billing_period === "credits");
  
  if (!hasCreditPlan) {
    allPlans.push(defaultPlans[4]); // Add the Pay as You Go plan
  }

  // Separate subscription plans from credit-based plans
  const subscriptionPlans = allPlans.filter(plan => plan.billing_period === "monthly");
  const creditPlans = allPlans.filter(plan => plan.billing_period === "credits");

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

        {/* Monthly Subscription Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-10">Monthly Subscription Plans</h3>
          
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {subscriptionPlans.map((plan, index) => (
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
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile carousel for subscription plans */}
          <div className="md:hidden">
            <Carousel>
              <CarouselContent>
                {subscriptionPlans.map((plan, index) => (
                  <CarouselItem key={`mobile-${plan.name}`} className="w-full">
                    <div className={`relative ${withDelay(animationClasses.fadeIn, 300 + (index * 100))}`}>
                      <Card
                        className={`h-full rounded-xl overflow-hidden transition-all duration-500 ${
                          plan.popular 
                            ? 'shadow-lg ring-2 ring-accent shadow-accent/10 z-10' 
                            : 'shadow-soft'
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
                              <div key={`${plan.name}-mobile-feature-${idx}`} className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5">
                                  <Check className="h-5 w-5" />
                                </div>
                                <span className="ml-3 text-slate-600">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4 gap-2">
                <CarouselPrevious className="relative static left-auto translate-y-0" />
                <CarouselNext className="relative static right-auto translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div>

        {/* Pay as You Go Credit Plan with Slider */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-center mb-6">Pay as You Go</h3>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Only pay for what you use with our flexible credit system. Start with 500 free credits!
          </p>

          <div className={`bg-white rounded-xl shadow-soft p-8 mb-8 max-w-4xl mx-auto ${withDelay(animationClasses.fadeIn, 400)}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="mb-8">
                  <Badge className="mb-2 bg-red-100 hover:bg-red-200 text-red-800 border-0">500 FREE CREDITS</Badge>
                  <h4 className="text-2xl font-bold mb-2">Pay as You Go Plan</h4>
                  <p className="text-slate-600">Perfect for occasional use or specific projects. One credit equals one business listing.</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {creditPlans[0]?.features.map((feature, idx) => (
                    <div key={`credit-plan-feature-${idx}`} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="ml-3 text-slate-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="default"
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
                >
                  Get 500 Free Credits
                </Button>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-10">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-500">Credits</span>
                    <span className="text-sm font-medium">{creditAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="mb-8 relative">
                    <Slider
                      value={[creditAmount]}
                      min={500}
                      max={50000}
                      step={100}
                      onValueChange={(value) => setCreditAmount(value[0])}
                      className="mb-6"
                    />
                    
                    <div className="flex justify-between px-1 mt-2">
                      {sliderMarkers.map(marker => (
                        <div 
                          key={marker} 
                          className="text-xs text-slate-500 flex flex-col items-center"
                          style={{ 
                            position: 'absolute', 
                            left: `${((marker - 500) / (50000 - 500)) * 100}%`, 
                            transform: 'translateX(-50%)' 
                          }}
                        >
                          <span className="w-1 h-1 bg-slate-300 rounded-full mb-1"></span>
                          {marker.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-500">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      <span>Estimated cost</span>
                    </div>
                    <div className="text-2xl font-bold">${estimatedCost}</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Buy Credits
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-slate-500 mb-4">
            Need a custom plan? Contact our sales team for a tailored solution.
          </p>
          <Button variant="outline" className="group">
            Contact Sales
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
