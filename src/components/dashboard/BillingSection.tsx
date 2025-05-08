
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getUserPlanInfo, subscribeToPlan } from "@/services/scraper";

export default function BillingSection() {
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get user's current plan info
  const { data: userPlan, isLoading: userPlanLoading } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });
  
  // Get available subscription plans from Supabase
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('plan_type', 'subscription')
        .order('price', { ascending: true });
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would connect to Stripe
      // and handle the subscription process
      const result = await subscribeToPlan(selectedPlanId);
      
      if (result.success) {
        toast.success("Subscription updated successfully!");
      } else {
        toast.error(result.error || "Failed to update subscription");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Failed to process your subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  // Get features for each plan
  const getFeatures = (planName: string) => {
    const features = {
      basic: [
        { name: "Unlimited scraping", included: true },
        { name: "Name and address data", included: true },
        { name: "Phone number and website data", included: true },
        { name: "City and state data", included: true },
        { name: "Review data", included: false },
        { name: "Priority support", included: false },
      ],
      pro: [
        { name: "Unlimited scraping", included: true },
        { name: "All business data fields", included: true },
        { name: "Review data access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
        { name: "Data API access", included: true },
      ]
    };
    
    return planName.toLowerCase().includes("pro") ? features.pro : features.basic;
  };

  const isPlanActive = (planId: string) => {
    return userPlan?.planId === planId;
  };

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the right plan for your data extraction needs</p>
      </div>
      
      {plansLoading || userPlanLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading plans...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans?.map((plan: any) => (
              <Card 
                key={plan.id} 
                className={`${selectedPlanId === plan.id ? 'ring-2 ring-primary' : ''} ${isPlanActive(plan.id) ? 'bg-primary/5' : ''}`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    {isPlanActive(plan.id) && (
                      <Badge className="ml-2">Current Plan</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description || ""}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${parseFloat(plan.price).toFixed(2)}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="space-y-2">
                    {getFeatures(plan.name).map((feature, idx) => (
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
                    variant={isPlanActive(plan.id) ? "outline" : "default"}
                    disabled={isPlanActive(plan.id)}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    {isPlanActive(plan.id) ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedPlanId && !isPlanActive(selectedPlanId) && (
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg" 
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="gap-2"
              >
                <CircleDollarSign className="h-4 w-4" />
                {isProcessing ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
          )}
          
          <div className="mt-12 bg-slate-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Current Plan</h3>
              {userPlan?.planName && <Badge>{userPlan.planName}</Badge>}
            </div>
            
            <p className="text-slate-600 mb-6">
              {userPlan?.planName ? (
                `You are currently on the ${userPlan.planName} plan with unlimited access to data extraction.`
              ) : (
                "You are currently on the Free plan with limited access to our features."
              )}
            </p>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => navigate('/dashboard/scrape')}
              >
                <span>Start Scraping</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
