
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

interface PlanData {
  id: string;
  name: string;
  price: number;
  is_recommended?: boolean;
}

export default function BillingSection() {
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
        .select('id, name, price, is_recommended')
        .eq('billing_period', 'monthly')
        .order('price', { ascending: true });
        
      if (error) throw error;
      
      // Convert to simpler format
      return (data || []).map(plan => ({
        id: plan.id.toString(),
        name: plan.name || "",
        price: plan.price || 0,
        is_recommended: plan.is_recommended || false
      }));
    }
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans?.map((plan: PlanData) => (
              <PlanCard 
                key={plan.id}
                plan={plan}
                isActive={isPlanActive(plan.id)}
                onSelect={setSelectedPlanId}
                features={getPlanFeatures(plan.name)}
              />
            ))}
          </div>
          
          <SubscriptionManager 
            selectedPlanId={selectedPlanId}
            isActivePlan={selectedPlanId ? isPlanActive(selectedPlanId) : false}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
          
          <CurrentPlanInfo userPlan={userPlan} />
        </>
      )}
    </Container>
  );
}
