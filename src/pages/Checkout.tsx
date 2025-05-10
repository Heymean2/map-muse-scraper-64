
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { HostedFieldsForm } from "@/components/checkout/HostedFieldsForm";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { PlanSelection } from "@/components/checkout/PlanSelection";
import { PlanSummary } from "@/components/checkout/PlanSummary";

interface PlanInfo {
  id: number;
  name: string;
  price: number;
  billing_period: string;
}

export default function Checkout() {
  const navigate = useNavigate();
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

  // Handle PayPal errors
  const handlePayPalError = (err: any) => {
    console.error("PayPal error:", err);
    setIsError(true);
    setErrorMessage("PayPal payment failed. Please try again.");
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
          <PaymentSuccess />
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
                  <PlanSelection 
                    plans={plansData}
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                  />
                ) : (
                  <p className="text-muted-foreground">No plans available</p>
                )}

                <PaymentForm
                  selectedPlan={selectedPlan}
                  isProcessing={isProcessing}
                  clientToken={clientToken}
                  createOrder={createOrder}
                  onApprove={(data) => captureOrder(data.orderID)}
                  onError={handlePayPalError}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <PlanSummary selectedPlan={selectedPlan} />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
