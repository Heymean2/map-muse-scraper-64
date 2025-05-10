
import { usePlanSelection } from "./usePlanSelection";
import { useCurrentPlan } from "./useCurrentPlan";
import { usePaymentProcessing } from "./usePaymentProcessing";
import { useAuthRedirect } from "./useAuthRedirect";

export function useCheckoutLogic() {
  // Check authentication and redirect if needed
  useAuthRedirect('/checkout');
  
  // Get plan selection state and data
  const { 
    selectedPlan, 
    setSelectedPlan,
    plansData,
    plansLoading 
  } = usePlanSelection();
  
  // Get current plan data
  const { 
    currentPlanData,
    currentPlanLoading,
    currentPlanError 
  } = useCurrentPlan();
  
  // Get payment processing functionality
  const {
    isProcessing,
    isSuccess,
    isError,
    errorMessage,
    createOrder: baseCreateOrder,
    captureOrder: baseCaptureOrder,
    handlePayPalError
  } = usePaymentProcessing();
  
  // Wrapper functions to include the selected plan
  const createOrder = async () => {
    return baseCreateOrder(selectedPlan);
  };
  
  const captureOrder = async (orderID: string) => {
    return baseCaptureOrder(orderID, selectedPlan);
  };

  return {
    isProcessing,
    isSuccess,
    isError,
    errorMessage,
    selectedPlan,
    plansData,
    currentPlanData,
    currentPlanLoading,
    currentPlanError,
    plansLoading,
    setSelectedPlan,
    createOrder,
    captureOrder,
    handlePayPalError
  };
}
