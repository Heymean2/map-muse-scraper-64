
import { useEffect } from 'react';
import { PayPalButtons as ReactPayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [{ isPending, isResolved, isRejected, options }] = usePayPalScriptReducer();
  
  useEffect(() => {
    onProcessingChange(isPending);
  }, [isPending, onProcessingChange]);
  
  if (isPending) {
    return (
      <div className="mt-6 p-4 flex flex-col items-center justify-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-center text-muted-foreground">Loading PayPal...</p>
      </div>
    );
  }
  
  if (isRejected) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>
          Failed to load PayPal. Please refresh the page or try a different payment method.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isResolved) {
    return null;
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
        forceReRender={[totalAmount, options]}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
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
