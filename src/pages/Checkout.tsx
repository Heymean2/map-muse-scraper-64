
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getPlanFeatures } from "@/components/dashboard/billing/PlanFeatures";

interface PlanDetails {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  // Extract plan ID from URL params
  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get("plan");

  // Fetch plan details if planId is provided
  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: ['planDetails', planId],
    queryFn: async () => {
      if (!planId) return null;
      
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('id, name, price, features')
        .eq('id', planId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!planId
  });

  // Set selected plan when data is fetched
  useEffect(() => {
    if (planData) {
      setSelectedPlan({
        id: planData.id.toString(),
        name: planData.name,
        price: planData.price,
        features: getPlanFeatures(planData.name)
      });
    }
  }, [planData]);

  // Handle payment processing
  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.");
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would initiate a payment flow
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        toast.success("Payment processed successfully!");
        navigate("/dashboard/billing");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed.");
    } finally {
      setLoading(false);
    }
  };

  // If no plan is selected and not loading, redirect to billing
  useEffect(() => {
    if (!planId && !planLoading) {
      navigate("/dashboard/billing");
    }
  }, [planId, planLoading, navigate]);

  if (planLoading) {
    return (
      <DashboardLayout>
        <Container>
          <div className="flex justify-center items-center h-64">
            <p>Loading checkout information...</p>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 -ml-3 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/dashboard/billing")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your subscription purchase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <Card className="md:col-span-1 border border-border shadow-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlan ? (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">{selectedPlan.name}</span>
                    <span>${selectedPlan.price}/mo</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Includes:</p>
                    <ul className="space-y-1">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p>No plan selected</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="mb-4" />
              <div className="flex justify-between w-full text-lg font-semibold">
                <span>Total</span>
                <span>${selectedPlan?.price || 0}/month</span>
              </div>
            </CardFooter>
          </Card>

          {/* Payment Methods */}
          <Card className="md:col-span-2 border border-border shadow-sm">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "paypal")}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M7.076 21.337H2.709a.577.577 0 0 1-.57-.653L4.943 5.09a.72.72 0 0 1 .711-.588h4.518c2.438 0 4.124.54 5.007 1.601.418.483.721 1.095.9 1.823.189.77.173 1.617-.047 2.635l-.008.04v.365l.294.17c.262.153.447.328.556.523.164.294.164.637.123.983-.045.362-.146.77-.283 1.153a5.304 5.304 0 0 1-.778 1.382c-.386.47-.851.850-1.387 1.12-.535.272-1.14.47-1.807.593-.663.122-1.371.183-2.126.183H8.93c-.51 0-.92.244-1.088.667l-.043.124-.856 5.425a.575.575 0 0 1-.57.499z" />
                      <path d="M19.193 7.913c-.298-1.386-1.377-2.107-3.233-2.107h-2.8a.711.711 0 0 0-.702.58l-1.898 12.041a.575.575 0 0 0 .568.664h2.246c.515 0 .953-.374 1.032-.884l.291-1.848.185-1.174a.712.712 0 0 1 .703-.58h.886c2.863 0 4.527-1.384 4.962-4.12.2-1.196.08-2.145-.24-2.834a2.155 2.155 0 0 0-.698-.738z" />
                    </svg>
                    PayPal
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="Name on card"
                          className="w-full px-3 py-2 border rounded-md" 
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border rounded-md" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border rounded-md" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVC</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          className="w-full px-3 py-2 border rounded-md" 
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="paypal">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center space-y-4">
                    <div className="flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0070ba" className="h-12 w-12">
                        <path d="M7.076 21.337H2.709a.577.577 0 0 1-.57-.653L4.943 5.09a.72.72 0 0 1 .711-.588h4.518c2.438 0 4.124.54 5.007 1.601.418.483.721 1.095.9 1.823.189.77.173 1.617-.047 2.635l-.008.04v.365l.294.17c.262.153.447.328.556.523.164.294.164.637.123.983-.045.362-.146.77-.283 1.153a5.304 5.304 0 0 1-.778 1.382c-.386.47-.851.85-1.387 1.12-.535.272-1.14.47-1.807.593-.663.122-1.371.183-2.126.183H8.93c-.51 0-.92.244-1.088.667l-.043.124-.856 5.425a.575.575 0 0 1-.57.499z" />
                        <path d="M19.193 7.913c-.298-1.386-1.377-2.107-3.233-2.107h-2.8a.711.711 0 0 0-.702.58l-1.898 12.041a.575.575 0 0 0 .568.664h2.246c.515 0 .953-.374 1.032-.884l.291-1.848.185-1.174a.712.712 0 0 1 .703-.58h.886c2.863 0 4.527-1.384 4.962-4.12.2-1.196.08-2.145-.24-2.834a2.155 2.155 0 0 0-.698-.738z" />
                      </svg>
                    </div>
                    <p className="text-sm">
                      Click the PayPal button below to log in to your PayPal account and complete your purchase.
                    </p>
                    <Button 
                      className="bg-[#0070ba] hover:bg-[#005ea6] w-full"
                    >
                      Pay with PayPal
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePayment} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? "Processing..." : `Complete Purchase ($${selectedPlan?.price || 0}/month)`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </DashboardLayout>
  );
}
