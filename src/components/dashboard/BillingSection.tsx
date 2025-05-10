
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";
import { supabase } from "@/integrations/supabase/client";
import { PlanCard } from "./billing/PlanCard";
import { getPlanFeatures } from "./billing/PlanFeatures";
import { SubscriptionManager } from "./billing/SubscriptionManager";
import { CurrentPlanInfo } from "./billing/CurrentPlanInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditPackageManager } from "./billing/CreditPackageManager";
import { Separator } from "@/components/ui/separator";
import { TransactionHistory } from "./billing/TransactionHistory";
import { Json } from "@/integrations/supabase/types";

interface PlanData {
  id: string | number; // Updated to accept both string and number
  name: string;
  price: number;
  billing_period: string;
  is_recommended?: boolean;
  price_per_credit?: number;
  features?: Json;
}

export default function BillingSection() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("subscription");
  
  // Get user's current plan info
  const { data: userPlan, isLoading: userPlanLoading } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });
  
  // Get available subscription plans from Supabase
  const { data: allPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['allPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('id, name, price, billing_period, is_recommended, price_per_credit, features')
        .order('price', { ascending: true });
        
      if (error) throw error;
      
      return data || [];
    }
  });
  
  // Filter plans by billing period (subscription or credits)
  const subscriptionPlans = allPlans?.filter(plan => plan.billing_period === 'monthly') || [];
  const creditPlans = allPlans?.filter(plan => plan.billing_period === 'credits') || [];

  const isPlanActive = (planId: string | number) => {
    if (!userPlan?.planId) return false;
    return String(userPlan.planId) === String(planId);
  };
  
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground">Choose the right plan for your data extraction needs</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="subscription">Monthly Subscription</TabsTrigger>
          <TabsTrigger value="credits">Pay-Per-Use Credits</TabsTrigger>
        </TabsList>
        
        {plansLoading || userPlanLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="border rounded-xl p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-1/4" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="subscription" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans?.map((plan) => (
                  <PlanCard 
                    key={plan.id}
                    plan={plan as PlanData}
                    isActive={isPlanActive(plan.id)}
                    onSelect={setSelectedPlanId}
                    features={getPlanFeatures(plan.name)}
                    planType="subscription"
                  />
                ))}
              </div>
              
              <SubscriptionManager 
                selectedPlanId={selectedPlanId}
                isActivePlan={selectedPlanId ? isPlanActive(selectedPlanId) : false}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </TabsContent>
            
            <TabsContent value="credits" className="mt-0">
              {creditPlans?.map((plan) => (
                <div key={plan.id} className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    {plan.name} - ${plan.price_per_credit?.toFixed(3)} per row
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Pay only for what you use. Each row extracted costs 1 credit.
                  </p>
                  
                  <CreditPackageManager 
                    pricePerCredit={plan.price_per_credit || 0.001} 
                    userPlan={userPlan}
                  />
                </div>
              ))}
            </TabsContent>
          </>
        )}
      </Tabs>
      
      <Separator className="my-8" />
      
      <CurrentPlanInfo userPlan={userPlan} />
      
      <div className="mt-8">
        <TransactionHistory />
      </div>
    </Container>
  );
}
