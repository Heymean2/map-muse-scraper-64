
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { checkUserFreeTierLimit } from "@/services/scraper";
import { CircleDollarSign, CheckCircle, CreditCard, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the PricingPlan type
interface PricingPlan {
  id: number;
  name: string;
  price: number;
  billing_period: string;
  row_limit: number;
  features: string[];
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
}

export default function Billing() {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  
  const { data: usageLimitData, isLoading } = useQuery({
    queryKey: ['userFreeTierLimit'],
    queryFn: checkUserFreeTierLimit
  });

  useEffect(() => {
    async function fetchPricingPlans() {
      try {
        const { data, error } = await supabase
          .from('pricing_plans')
          .select('*')
          .order('price', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          // Parse the JSON features
          const plansWithParsedFeatures = data.map(plan => ({
            ...plan,
            features: Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features)
          }));
          
          setPricingPlans(plansWithParsedFeatures);
          
          // Set the Free Plan as current
          const freePlan = plansWithParsedFeatures.find(plan => plan.price === 0);
          if (freePlan) setCurrentPlan(freePlan);
        }
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        toast.error('Failed to load pricing plans');
      }
    }
    
    fetchPricingPlans();
  }, []);

  const calculateUsagePercentage = () => {
    if (!usageLimitData) return 0;
    return Math.min(Math.round((usageLimitData.totalRows / usageLimitData.freeRowsLimit) * 100), 100);
  };

  const handleUpgrade = (planId: number) => {
    toast('Upgrade functionality coming soon!');
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan and payment details</p>
        </div>
        
        {/* Current plan status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
              <div>
                <h3 className="font-bold text-xl">{currentPlan?.name || 'Free Plan'}</h3>
                <p className="text-sm text-muted-foreground">
                  Limited to {currentPlan?.row_limit || 500} rows of data
                </p>
              </div>
              <Button onClick={() => handleUpgrade(2)}>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Data Usage</span>
                <span className="text-sm">
                  {isLoading ? 'Loading...' : `${usageLimitData?.totalRows || 0} / ${currentPlan?.row_limit || 500} rows`}
                </span>
              </div>
              <Progress value={calculateUsagePercentage()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {usageLimitData?.isExceeded 
                  ? "You've exceeded the free tier limit. Upgrade to continue accessing all your data."
                  : "You're currently within the free tier limits."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Plan comparison */}
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={plan.is_recommended ? "border-primary/50" : ""}>
              <CardHeader>
                {plan.is_recommended && (
                  <div className="bg-primary/5 absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold text-primary">
                    RECOMMENDED
                  </div>
                )}
                <CardTitle className="flex items-center">
                  {plan.name}
                  {plan.price === 0 && (
                    <Badge className="ml-2 bg-green-500">Current</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {plan.price === 0 ? "Basic features for personal use" : "Advanced features for power users"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-3xl font-bold">
                  ${plan.price}<span className="text-base font-normal text-muted-foreground">/{plan.billing_period}</span>
                </p>
                
                <Separator />
                
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  
                  {plan.price === 0 && (
                    <>
                      <li className="flex items-center gap-2 opacity-50">
                        <Lock className="h-4 w-4" />
                        <span>Unlimited data storage</span>
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <Lock className="h-4 w-4" />
                        <span>Priority processing</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.price === 0 ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : (
                  <Button className="w-full" onClick={() => handleUpgrade(plan.id)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </DashboardLayout>
  );
}
