
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  PayPalButtons,
  PayPalHostedField,
  PayPalHostedFieldsProvider,
  usePayPalHostedFields
} from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanInfo {
  id: number;
  name: string;
  price: number;
  billing_period: string;
}

// Component for credit card form
const HostedFieldsForm = ({ onApprove }: { onApprove: (orderData: any) => void }) => {
  const { cardFields } = usePayPalHostedFields();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = () => {
    if (!cardFields) {
      toast.error("Card fields are not ready");
      return;
    }

    setIsSubmitting(true);
    
    cardFields.submit({
      cardholderName: document.querySelector<HTMLInputElement>("#card-holder-name")?.value,
    }).then(orderData => {
      onApprove(orderData);
    }).catch(error => {
      console.error("Card payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    }).finally(() => {
      setIsSubmitting(false);
    });
  };
  
  const isFormInvalid = !cardFields;

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="card-holder-name" className="block text-sm font-medium">
            Cardholder Name
          </label>
          <input
            id="card-holder-name"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            type="text"
            placeholder="Name on card"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Card Number</label>
          <div className="border rounded-md px-3 py-2">
            <PayPalHostedField
              id="card-number"
              hostedFieldType="number"
              options={{
                selector: "#card-number",
                placeholder: "Card number"
              }}
              className="w-full bg-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Expiration Date</label>
            <div className="border rounded-md px-3 py-2">
              <PayPalHostedField
                id="expiration-date"
                hostedFieldType="expirationDate"
                options={{
                  selector: "#expiration-date",
                  placeholder: "MM/YY"
                }}
                className="w-full bg-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Security Code</label>
            <div className="border rounded-md px-3 py-2">
              <PayPalHostedField
                id="cvv"
                hostedFieldType="cvv"
                options={{
                  selector: "#cvv",
                  placeholder: "123"
                }}
                className="w-full bg-transparent"
              />
            </div>
          </div>
        </div>
        
        <Button
          onClick={submitHandler}
          disabled={isFormInvalid || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);
  
  const session = supabase.auth.getSession();

  // Fetch current user plan
  const { data: currentPlanData, isLoading: currentPlanLoading, error: currentPlanError } = useQuery({
    queryKey: ['currentPlan'],
    queryFn: async () => {
      const token = (await session).data.session?.access_token;
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      // Use the direct Supabase URL with project ID
      const response = await fetch(`https://culwnizfggplctdtujsz.supabase.co/functions/v1/getCurrentPlan`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error("Failed to fetch current plan:", await response.text());
        throw new Error("Failed to fetch current plan");
      }
      
      return response.json();
    }
  });
  
  // Fetch available plans
  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Selected plan state
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  
  // Set default selected plan when data is loaded
  useEffect(() => {
    if (plansData && plansData.length > 0) {
      // If no plan is selected, select the first one available
      if (!selectedPlan) {
        setSelectedPlan(plansData[0]);
      }
    }
  }, [plansData, selectedPlan]);

  // Fetch client token for PayPal Hosted Fields
  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        // For demo purposes, we're using a dummy token
        // In a real application, you would fetch this from your server
        setClientToken("sandbox_8hxpnkht_kzdtzv2btm4p7s4b");
      } catch (error) {
        console.error("Error fetching client token:", error);
        setErrorMessage("Failed to initialize payment form");
      }
    };

    fetchClientToken();
  }, []);
  
  // Create order for PayPal
  const createOrder = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return null;
    }
    
    setIsProcessing(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      const sessionResponse = await session;
      const token = sessionResponse.data.session?.access_token;
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      // Use the direct Supabase URL with project ID
      const response = await fetch(`https://culwnizfggplctdtujsz.supabase.co/functions/v1/createOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: selectedPlan.id
        })
      });
      
      if (!response.ok) {
        console.error("Failed to create order:", await response.text());
        throw new Error("Failed to create order");
      }
      
      const data = await response.json();
      return data.orderID;
    } catch (error) {
      console.error("Error creating order:", error);
      setIsError(true);
      setErrorMessage(error.message || "Failed to create order");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Capture order after approval
  const captureOrder = async (orderID: string) => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }
    
    setIsProcessing(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      const sessionResponse = await session;
      const token = sessionResponse.data.session?.access_token;
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      // Use the direct Supabase URL with project ID
      const response = await fetch(`https://culwnizfggplctdtujsz.supabase.co/functions/v1/captureOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderID,
          plan: selectedPlan.id
        })
      });
      
      if (!response.ok) {
        console.error("Failed to capture order:", await response.text());
        throw new Error("Failed to capture payment");
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        toast.success("Payment successful!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        throw new Error("Payment was not successful");
      }
    } catch (error) {
      console.error("Error capturing order:", error);
      setIsError(true);
      setErrorMessage(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle redirects if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth', { state: { returnUrl: '/checkout' } });
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (currentPlanLoading || plansLoading) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  if (currentPlanError) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {currentPlanError.message || "Failed to load your current plan. Please try again."}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  if (isSuccess) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle>Payment Successful</CardTitle>
              </div>
              <CardDescription>
                Your plan has been updated successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You will be redirected to the dashboard shortly.</p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">Upgrade Your Plan</h1>
        
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {errorMessage || "An error occurred. Please try again."}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select a Plan</CardTitle>
                <CardDescription>Choose a plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                {plansData && plansData.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {plansData.map((plan: PlanInfo) => (
                      <div
                        key={plan.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPlan?.id === plan.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <h3 className="font-medium">{plan.name}</h3>
                        <div className="text-2xl font-bold my-2">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.billing_period}
                          </span>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <div className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 inline-block mt-1">
                            Selected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No plans available</p>
                )}

                <Tabs defaultValue="paypal" onValueChange={(v) => setPaymentMethod(v as "paypal" | "card")}>
                  <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="paypal" className="mt-6">
                    {selectedPlan ? (
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          shape: "rect"
                        }}
                        disabled={isProcessing}
                        forceReRender={[selectedPlan.id, selectedPlan.price]}
                        createOrder={createOrder}
                        onApprove={(data) => {
                          return captureOrder(data.orderID);
                        }}
                        onError={(err) => {
                          console.error("PayPal error:", err);
                          setIsError(true);
                          setErrorMessage("PayPal payment failed. Please try again.");
                        }}
                      />
                    ) : (
                      <div className="text-center py-4">
                        Please select a plan to continue.
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="card" className="mt-6">
                    {selectedPlan && clientToken ? (
                      <PayPalHostedFieldsProvider
                        createOrder={createOrder}
                        dataClientToken={clientToken} // Add client token here
                      >
                        <HostedFieldsForm 
                          onApprove={(orderData) => captureOrder(orderData.orderID)} 
                        />
                      </PayPalHostedFieldsProvider>
                    ) : (
                      <div className="text-center py-4">
                        {!selectedPlan ? "Please select a plan to continue." : "Loading payment form..."}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPlan ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <span>Plan:</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Billing Period:</span>
                      <span>{selectedPlan.billing_period}</span>
                    </div>
                    <div className="border-t my-4 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${selectedPlan.price}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No plan selected</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
