
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";
import { supabase } from "@/integrations/supabase/client";
import { PlanCard } from "./billing/PlanCard";
import { getPlanFeatures } from "./billing/PlanFeatures";
import { SubscriptionManager } from "./billing/SubscriptionManager";
import { CurrentPlanInfo } from "./billing/CurrentPlanInfo";

interface PlanData {
  id: string;
  name: string;
  description?: string;
  price: number;
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
        .select('id, name, description, price, plan_type')
        .eq('plan_type', 'subscription')
        .order('price', { ascending: true });
        
      if (error) throw error;
      
      // Convert to simpler format to avoid deep nesting
      return (data || []).map(plan => ({
        id: plan.id.toString(),
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || 0
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
        <div className="flex justify-center items-center h-64">
          <p>Loading plans...</p>
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
