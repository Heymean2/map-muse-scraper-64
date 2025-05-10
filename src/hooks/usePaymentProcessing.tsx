
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { purchaseCredits, subscribeToPlan } from "@/services/scraper";

interface PaymentProcessingHookProps {
  planId: string | null;
  planData: any;
  planType: string;
  creditQuantity: number;
  totalCredits: number;
  totalAmount: number;
}

export function usePaymentProcessing({
  planId,
  planData,
  planType,
  creditQuantity,
  totalCredits,
  totalAmount
}: PaymentProcessingHookProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Function to record transaction in Supabase
  const recordTransaction = async ({
    paymentMethod,
    paymentId,
    status,
    billingPeriod,
    creditsPurchased
  }: {
    paymentMethod: string;
    paymentId?: string;
    status: string;
    billingPeriod?: string;
    creditsPurchased?: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Authentication required');
      return false;
    }
    
    const { error } = await supabase
      .from('billing_transactions')
      .insert({
        user_id: user.id,
        plan_id: planId ? parseInt(planId) : null,
        amount: totalAmount,
        payment_method: paymentMethod,
        payment_id: paymentId,
        status,
        billing_period: billingPeriod,
        credits_purchased: creditsPurchased,
        metadata: {
          plan_type: planType
        }
      });
      
    if (error) {
      console.error('Error recording transaction:', error);
      return false;
    }
    
    return true;
  };

  // Handle credit card payment
  const handleCreditCardPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (planType === 'subscription' && planId) {
        const result = await subscribeToPlan(planId);
        
        if (result.success) {
          // Record transaction
          await recordTransaction({
            paymentMethod: 'card',
            status: 'completed',
            billingPeriod: 'monthly',
          });
          
          setPaymentSuccess(true);
          toast.success('Subscription activated successfully!');
        } else {
          toast.error(result.error || 'Failed to activate subscription');
        }
      } else if (planType === 'credits') {
        const purchased = await purchaseCredits(creditQuantity);
        
        if (purchased) {
          // Record transaction
          await recordTransaction({
            paymentMethod: 'card',
            status: 'completed',
            creditsPurchased: totalCredits,
          });
          
          setPaymentSuccess(true);
          toast.success(`Successfully purchased ${totalCredits} credits!`);
        } else {
          toast.error('Failed to purchase credits');
        }
      }
    } catch (error: any) {
      toast.error(`Payment error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = async () => {
    try {
      if (planType === 'subscription' && planId) {
        const result = await subscribeToPlan(planId);
        if (result.success) {
          await recordTransaction({
            paymentMethod: 'paypal',
            status: 'completed',
            billingPeriod: 'monthly',
          });
          
          setPaymentSuccess(true);
          toast.success('Subscription activated successfully!');
        } else {
          toast.error(result.error || 'Failed to activate subscription');
        }
      } else if (planType === 'credits') {
        const purchased = await purchaseCredits(creditQuantity);
        
        if (purchased) {
          await recordTransaction({
            paymentMethod: 'paypal',
            status: 'completed',
            creditsPurchased: totalCredits,
          });
          
          setPaymentSuccess(true);
          toast.success(`Successfully purchased ${totalCredits} credits!`);
        } else {
          toast.error('Failed to purchase credits');
        }
      }
    } catch (error: any) {
      toast.error(`Payment error: ${error.message || 'Unknown error'}`);
    }
  };

  return {
    isProcessing,
    setIsProcessing,
    paymentSuccess,
    setPaymentSuccess,
    handleCreditCardPayment,
    handlePayPalSuccess
  };
}
