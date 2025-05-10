
import { useState } from "react";
import { Container } from "@/components/ui/container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUserPlanInfo } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";
import { CreditPackageOptions } from "@/components/checkout/CreditPackageOptions";
import { SuccessDialog } from "@/components/checkout/SuccessDialog";
import { PayPalButtons } from "@/components/checkout/PayPalButtons";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId");
  const planType = searchParams.get("planType") || "subscription";
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  // Get current user's plan info
  const { data: userPlan } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });

  // Fetch the selected plan details from Supabase
  const { data: planData, isLoading: planLoading } = useQuery({
    queryKey: ['checkoutPlan', planId],
    queryFn: async () => {
      if (!planId) return null;
      
      // Convert planId to number before using it for database query
      const planIdNum = parseInt(planId, 10);
      
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('id', planIdNum)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!planId
  });
  
  // Check if the user is trying to purchase the same plan they already have
  const isSamePlan = userPlan?.planId === (planId ? parseInt(planId, 10) : null) && planType === 'subscription';

  // Get package size from URL param or default to 1
  const packageSizeParam = searchParams.get("packageSize");
  // Convert packageSize to number explicitly, ensuring it's a valid number
  const [creditQuantity, setCreditQuantity] = useState<number>(
    packageSizeParam ? Number(packageSizeParam) || 1 : 1
  );
  
  const creditPrice = planData?.price_per_credit || 0.001;
  const totalCredits = creditQuantity * 1000; // 1000 credits per package
  const totalAmount = planType === 'subscription' 
    ? planData?.price || 0 
    : (creditPrice * totalCredits);

  // Payment processing hook
  const {
    isProcessing,
    setIsProcessing,
    paymentSuccess,
    setPaymentSuccess,
    handleCreditCardPayment,
    handlePayPalSuccess
  } = usePaymentProcessing({
    planId,
    planData,
    planType,
    creditQuantity,
    totalCredits,
    totalAmount
  });

  // PayPal configuration options
  const paypalOptions = {
    clientId: "test", // Replace with actual client ID in production
    currency: "USD",
    intent: "capture",
  };

  if (!planId) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No plan selected</h2>
            <p className="mb-6">Please select a plan from the pricing page.</p>
            <button 
              onClick={() => navigate('/dashboard/billing')}
              className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Pricing
            </button>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  if (isSamePlan) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">You already have this plan</h2>
            <p className="mb-6">You are already subscribed to the {userPlan?.planName} plan.</p>
            <button 
              onClick={() => navigate('/dashboard/billing')}
              className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Back to Pricing
            </button>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PayPalScriptProvider options={paypalOptions}>
        <Container className="py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <PaymentMethods 
                onPaymentMethodChange={setPaymentMethod}
                onCreditCardSubmit={handleCreditCardPayment}
                isProcessing={isProcessing}
                totalAmount={totalAmount}
              />
              
              {/* PayPal Button Handler */}
              {paymentMethod === "paypal" && (
                <PayPalButtons 
                  totalAmount={totalAmount}
                  planType={planType}
                  planData={planData}
                  creditQuantity={creditQuantity}
                  totalCredits={totalCredits}
                  onSuccess={handlePayPalSuccess}
                  onProcessingChange={setIsProcessing}
                />
              )}
              
              {planType === 'credits' && (
                <CreditPackageOptions 
                  creditPrice={creditPrice}
                  creditQuantity={creditQuantity}
                  onCreditQuantityChange={setCreditQuantity}
                />
              )}
            </div>
            
            <div>
              <OrderSummary 
                planData={planData}
                planLoading={planLoading}
                planType={planType}
                totalAmount={totalAmount}
                totalCredits={totalCredits}
              />
            </div>
          </div>
          
          <SuccessDialog 
            open={paymentSuccess}
            onOpenChange={(open) => {
              if (!open) navigate('/dashboard');
              setPaymentSuccess(open);
            }}
            planType={planType}
            planName={planData?.name}
            totalCredits={totalCredits}
          />
        </Container>
      </PayPalScriptProvider>
    </DashboardLayout>
  );
}
