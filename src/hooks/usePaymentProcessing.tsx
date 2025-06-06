
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePaymentProcessing() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Create order for PayPal
  const createOrder = async (selectedPlan: any) => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return null;
    }
    
    setIsProcessing(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      // Get URL parameters to check if this is a credit purchase with custom amount
      const urlParams = new URLSearchParams(window.location.search);
      const creditAmount = urlParams.get('creditAmount');
      const planType = urlParams.get('planType');
      
      // Prepare payload based on whether it's a custom credit amount or regular plan
      const payload = planType === 'credits' && creditAmount 
        ? { plan: selectedPlan.id, creditAmount: parseInt(creditAmount) }
        : { plan: selectedPlan.id };
      
      const response = await fetch(`https://culwnizfggplctdtujsz.supabase.co/functions/v1/createOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error("Failed to create order:", await response.text());
        throw new Error("Failed to create order");
      }
      
      const data = await response.json();
      return data.orderID;
    } catch (error: any) {
      console.error("Error creating order:", error);
      setIsError(true);
      setErrorMessage(error.message || "Failed to create order");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Capture order after approval
  const captureOrder = async (orderID: string, selectedPlan: any) => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }
    
    setIsProcessing(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
      // Get URL parameters to check if this is a credit purchase with custom amount
      const urlParams = new URLSearchParams(window.location.search);
      const creditAmount = urlParams.get('creditAmount');
      const planType = urlParams.get('planType');
      
      // Prepare payload based on whether it's a custom credit amount or regular plan
      const payload = planType === 'credits' && creditAmount 
        ? { orderID, plan: selectedPlan.id, creditAmount: parseInt(creditAmount) }
        : { orderID, plan: selectedPlan.id };
      
      const response = await fetch(`https://culwnizfggplctdtujsz.supabase.co/functions/v1/captureOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
    } catch (error: any) {
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

  return {
    isProcessing,
    isSuccess,
    isError,
    errorMessage,
    createOrder,
    captureOrder,
    handlePayPalError
  };
}
