
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { PlanSummary } from "@/components/checkout/PlanSummary";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import { CreditPackageOptions } from "@/components/checkout/CreditPackageOptions";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [creditAmount, setCreditAmount] = useState<number>(1000);
  const [creditPrice, setCreditPrice] = useState<number>(0);
  const [planType, setPlanType] = useState<string>("subscription");
  
  const {
    isProcessing,
    isSuccess,
    isError,
    errorMessage,
    selectedPlan,
    plansData,
    currentPlanLoading,
    currentPlanError,
    plansLoading,
    setSelectedPlan,
    createOrder,
    captureOrder,
    handlePayPalError
  } = useCheckoutLogic();

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planIdParam = params.get("planId");
    const planTypeParam = params.get("planType");
    const creditAmountParam = params.get("creditAmount");
    
    if (planTypeParam) {
      setPlanType(planTypeParam);
    }
    
    if (creditAmountParam) {
      setCreditAmount(parseInt(creditAmountParam));
    }
    
    // If we have plansData and a planId parameter, set the selected plan
    if (plansData && planIdParam) {
      // If it's a credit plan, find the credit plan
      if (planTypeParam === 'credits') {
        const creditPlan = plansData.find(p => p.billing_period === 'credits');
        if (creditPlan) {
          setSelectedPlan(creditPlan);
          // Set the price_per_credit from the actual plan data
          setCreditPrice(creditPlan.price_per_credit || 0);
          console.log("Credit plan selected:", creditPlan);
        }
      } else {
        // For subscription plans, find by ID
        const plan = plansData.find(p => String(p.id) === planIdParam);
        if (plan) {
          setSelectedPlan(plan);
        }
      }
    } else if (plansData && plansData.length > 0 && !planIdParam) {
      // If no plan selected, redirect back to billing
      navigate('/dashboard/billing');
    }
  }, [location, plansData, setSelectedPlan, navigate]);

  // Fetch credit plan directly if it's not in the plansData
  useEffect(() => {
    if (planType === 'credits' && (!selectedPlan || !selectedPlan.price_per_credit)) {
      const fetchCreditPlan = async () => {
        try {
          const { data, error } = await supabase
            .from('pricing_plans')
            .select('*')
            .eq('billing_period', 'credits')
            .single();

          if (error) {
            console.error("Error fetching credit plan:", error);
            return;
          }

          if (data) {
            console.log("Credit plan fetched directly:", data);
            setSelectedPlan(data);
            setCreditPrice(data.price_per_credit || 0);
          }
        } catch (error) {
          console.error("Error in credit plan fetch:", error);
        }
      };

      fetchCreditPlan();
    }
  }, [planType, selectedPlan, setSelectedPlan]);

  // Update URL when credit amount changes
  useEffect(() => {
    if (planType === 'credits' && selectedPlan) {
      const params = new URLSearchParams(location.search);
      params.set('creditAmount', creditAmount.toString());
      
      // Update URL without full page reload
      const newUrl = `${location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [creditAmount, planType, selectedPlan, location]);

  // Log the current state for debugging
  useEffect(() => {
    console.log("Current state:", {
      selectedPlan,
      creditPrice,
      creditAmount,
      planType
    });
  }, [selectedPlan, creditPrice, creditAmount, planType]);

  // Wrapper for createOrder to include creditAmount
  const handleCreateOrder = async () => {
    return createOrder();
  };

  // Wrapper for captureOrder to include creditAmount
  const handleCaptureOrder = async (orderID: string) => {
    return captureOrder(orderID);
  };

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
          <Button onClick={() => window.location.href = '/dashboard'}>
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

  if (!selectedPlan) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <Alert className="mb-6">
            <AlertDescription>
              No plan selected. Please select a plan from the billing page.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/dashboard/billing')}>
            Back to Plans
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  const pageTitle = planType === 'credits' ? 'Purchase Credits' : 'Upgrade Your Plan';

  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
        
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
                <CardTitle>
                  {planType === 'credits' ? 'Selected Credit Package' : 'Selected Plan'}
                </CardTitle>
                <CardDescription>
                  {planType === 'credits' ? 'Purchase credits for data extraction' : selectedPlan?.name}
                </CardDescription>
                <Button 
                  variant="ghost" 
                  className="mt-2 pl-0" 
                  onClick={() => navigate('/dashboard/billing')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to plans
                </Button>
              </CardHeader>
              <CardContent>
                {planType === 'credits' && (
                  <CreditPackageOptions 
                    creditPrice={selectedPlan.price_per_credit || creditPrice}
                    creditQuantity={creditAmount}
                    onCreditQuantityChange={setCreditAmount}
                  />
                )}

                <PaymentForm
                  selectedPlan={selectedPlan}
                  isProcessing={isProcessing}
                  createOrder={handleCreateOrder}
                  onApprove={(data) => handleCaptureOrder(data.orderID)}
                  onError={handlePayPalError}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <PlanSummary 
              selectedPlan={selectedPlan} 
              customCredits={planType === 'credits' ? creditAmount : undefined}
              creditPrice={selectedPlan.price_per_credit || creditPrice}
            />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
