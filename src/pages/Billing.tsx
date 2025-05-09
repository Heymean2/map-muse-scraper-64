
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import BillingSection from "@/components/dashboard/BillingSection";
import { Skeleton } from "@/components/ui/skeleton";

export default function Billing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  // Fetch pricing plans from Supabase
  const { data: pricingPlans, isLoading } = useQuery({
    queryKey: ['pricingPlans', billingPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('billing_period', billingPeriod)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  const handleUpgrade = (planId: number, planName: string) => {
    // For demo purposes - this would connect to a payment processor in a real app
    toast("Upgrade initiated", {
      description: `You selected the ${planName} plan. This would connect to a payment processor in a real application.`,
    });
  };
  
  // Function to parse features from JSON to array
  const getFeatures = (featuresJson: any): string[] => {
    if (!featuresJson) return [];
    if (typeof featuresJson === 'string') {
      try {
        return JSON.parse(featuresJson);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(featuresJson) ? featuresJson.map(f => String(f)) : [];
  };
  
  return (
    <div className="w-full">
      <BillingSection />
    </div>
  );
}
