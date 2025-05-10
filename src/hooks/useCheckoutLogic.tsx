import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCheckoutLogic() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  
  const session = supabase.auth.getSession();

  // Fetch current user plan
  const { data: currentPlanData, isLoading: currentPlanLoading, error: currentPlanError } = useQuery({
    queryKey: ['currentPlan'],
    queryFn: async () => {
      const token = (await session).data.session?.access_token;
      
      if (!token) {
        throw new Error("Not authenticated");
      }
      
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
  
  // Set default selected plan when data is loaded
  useEffect(() => {
    if (plansData && plansData.length > 0) {
      // If no plan is selected, select the first one available
      if (!selectedPlan) {
        setSelectedPlan(plansData[0]);
      }
    }
  }, [plansData, selectedPlan]);
  
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
