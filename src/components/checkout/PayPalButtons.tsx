
import { useEffect, useState } from 'react';
import { PayPalButtons as ReactPayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

interface PayPalButtonsProps {
  totalAmount: number;
  planType: string;
  planData?: any;
  creditQuantity?: number;
  totalCredits?: number;
  onSuccess: () => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

export function PayPalButtons({
  totalAmount,
  planType,
  planData,
  creditQuantity = 1,
  totalCredits = 1000,
  onSuccess,
  onProcessingChange
}: PayPalButtonsProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  
  useEffect(() => {
    if (isPending) {
      onProcessingChange(true);
    } else {
      onProcessingChange(false);
    }
  }, [isPending, onProcessingChange]);
  
  if (isPending) {
    return (
      <div className="mt-6 p-4 text-center">
        <p>Loading PayPal...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ReactPayPalButtons
        style={{ 
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay"
        }}
        createOrder={(data, actions) => {
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
        }}
        onApprove={async (data, actions) => {
          onProcessingChange(true);
          
          if (actions.order) {
            try {
              await actions.order.capture();
              onSuccess();
              toast.success("Payment successful!");
            } catch (error: any) {
              toast.error(`Payment error: ${error.message || 'Unknown error'}`);
            } finally {
              onProcessingChange(false);
            }
          }
        }}
        onCancel={() => {
          toast.info('Payment cancelled');
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          toast.error('Payment failed. Please try again.');
        }}
      />
    </div>
  );
}
