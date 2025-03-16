
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export default function Billing() {
  const { toast } = useToast();
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
    toast({
      title: "Upgrade initiated",
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
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your subscription and payment details</p>
        </div>
        
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans">
            <div className="flex justify-end mb-6">
              <div className="inline-flex items-center rounded-lg border p-1 bg-background">
                <Button
                  variant={billingPeriod === "monthly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingPeriod("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingPeriod === "yearly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingPeriod("yearly")}
                >
                  Yearly
                  <Badge variant="outline" className="ml-2 bg-primary/20">Save 20%</Badge>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="flex flex-col">
                    <CardHeader>
                      <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Array(4).fill(0).map((_, j) => (
                          <div key={j} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="mt-auto pt-4">
                      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                pricingPlans?.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`flex flex-col ${plan.is_recommended ? 'border-primary' : ''}`}
                  >
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        ${plan.price}{billingPeriod === "monthly" ? "/month" : "/year"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2">
                        {getFeatures(plan.features).map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={plan.price > 0 ? "default" : "outline"} 
                        className="w-full"
                        onClick={() => handleUpgrade(plan.id, plan.name)}
                      >
                        {plan.price > 0 ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Upgrade Now
                          </>
                        ) : "Current Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  No payment methods added yet
                </p>
                <Button className="w-full md:w-auto">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your previous invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  No billing history available
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
