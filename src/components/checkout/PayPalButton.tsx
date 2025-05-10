
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PayPalButtonProps {
  totalAmount: number;
  planType: string;
  planData?: any;
  creditQuantity?: number;
  totalCredits?: number;
  onSuccess: () => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

export function PayPalButton({
  totalAmount,
  planType,
  planData,
  creditQuantity = 1,
  totalCredits = 1000,
  onSuccess,
  onProcessingChange
}: PayPalButtonProps) {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);

  // Load PayPal script
  useEffect(() => {
    if (!paypalLoaded && planData) {
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=test&currency=USD&components=buttons";
      script.addEventListener('load', () => {
        console.log("PayPal SDK loaded successfully");
        setPaypalLoaded(true);
      });
      script.addEventListener('error', (e) => {
        console.error("PayPal SDK failed to load:", e);
        toast.error("Failed to load payment provider. Please try again later.");
      });
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [paypalLoaded, planData]);

  // Render PayPal buttons
  useEffect(() => {
    const renderPayPalButtons = () => {
      const paypalContainer = document.getElementById('paypal-button-container');
      
      if (paypalContainer && window.paypal && typeof window.paypal.Buttons === 'function') {
        // Clear any existing buttons
        paypalContainer.innerHTML = '';
        
        try {
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: totalAmount.toFixed(2)
                  },
                  description: planType === 'subscription' 
                    ? `${planData?.name} Subscription` 
                    : `${totalCredits} Credits Purchase`
                }]
              });
            },
            onApprove: async (data, actions) => {
              onProcessingChange(true);
              
              if (actions.order) {
                try {
                  const order = await actions.order.capture();
                  onSuccess();
                } catch (error: any) {
                  toast.error(`Payment error: ${error.message || 'Unknown error'}`);
                } finally {
                  onProcessingChange(false);
                }
              }
            },
            onCancel: () => {
              toast.info('Payment cancelled');
            },
            onError: (err) => {
              console.error('PayPal error:', err);
              toast.error('Payment failed. Please try again.');
            }
          }).render(paypalContainer);
          
          setPaypalButtonRendered(true);
        } catch (error) {
          console.error("Error rendering PayPal buttons:", error);
          toast.error("Error setting up payment method. Please try again or use a different payment option.");
        }
      } else if (paypalContainer) {
        paypalContainer.innerHTML = '<div class="p-4 text-center text-red-500">PayPal payment option is temporarily unavailable. Please try again later or use a different payment method.</div>';
      }
    };

    if (paypalLoaded && !paypalButtonRendered) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, paypalButtonRendered, totalAmount, planData, planType, totalCredits, onSuccess, onProcessingChange]);

  return null;
}
