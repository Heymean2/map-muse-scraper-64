
import { useEffect } from "react";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import { useCheckoutUrlParams } from "@/hooks/useCheckoutUrlParams";
import { 
  CheckoutLoading, 
  CheckoutError, 
  NoPlanSelected, 
  CheckoutSuccessState 
} from "@/components/checkout/CheckoutStates";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export default function Checkout() {
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
  
  const {
    creditAmount,
    setCreditAmount,
    creditPrice,
    planType,
  } = useCheckoutUrlParams(plansData || [], setSelectedPlan);

  // Log the current state for debugging
  useEffect(() => {
    console.log("Current checkout state:", {
      selectedPlan,
      creditPrice,
      creditAmount,
      planType
    });
  }, [selectedPlan, creditPrice, creditAmount, planType]);

  // Handle loading state
  if (currentPlanLoading || plansLoading) {
    return <CheckoutLoading />;
  }

  // Handle error state
  if (currentPlanError) {
    return <CheckoutError message={currentPlanError.message} />;
  }

  // Handle success state
  if (isSuccess) {
    return <CheckoutSuccessState />;
  }

  // Handle no plan selected
  if (!selectedPlan) {
    return <NoPlanSelected />;
  }

  // Render main checkout content
  return (
    <CheckoutContent 
      planType={planType}
      selectedPlan={selectedPlan}
      creditAmount={creditAmount}
      creditPrice={creditPrice}
      isError={isError}
      errorMessage={errorMessage}
      isProcessing={isProcessing}
      onCreditAmountChange={setCreditAmount}
      createOrder={createOrder}
      captureOrder={captureOrder}
      handlePayPalError={handlePayPalError}
    />
  );
}
