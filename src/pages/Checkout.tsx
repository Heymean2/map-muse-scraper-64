
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

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [creditAmount, setCreditAmount] = useState<number>(1000);
  const [creditPrice, setCreditPrice] = useState<number>(0.00299);
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
      const plan = plansData.find(p => String(p.id) === planIdParam);
      if (plan) {
        setSelectedPlan(plan);
        
        // If it's a credit plan, set the credit price
        if (plan.billing_period === 'credits') {
          setCreditPrice(plan.price_per_credit || 0.00299);
        }
      }
    } else if (plansData && plansData.length > 0 && !planIdParam) {
      // If no plan selected, redirect back to billing
      navigate('/dashboard/billing');
    }
  }, [location, plansData, setSelectedPlan, navigate]);

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

  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">
          {planType === 'credits' ? 'Purchase Credits' : 'Upgrade Your Plan'}
        </h1>
        
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
                  {selectedPlan?.name || "Checkout"}
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
                    creditPrice={creditPrice}
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
              creditPrice={creditPrice}
            />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
