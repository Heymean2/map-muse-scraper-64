
import { 
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentFormProps {
  selectedPlan: any;
  isProcessing: boolean;
  createOrder: () => Promise<any>;
  onApprove: (data: any) => Promise<void>;
  onError: (err: any) => void;
}

export function PaymentForm({
  selectedPlan,
  isProcessing,
  createOrder,
  onApprove,
  onError
}: PaymentFormProps) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading payment options...</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>
          Failed to load payment options. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-6">
      {selectedPlan ? (
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "rect"
          }}
          disabled={isProcessing}
          forceReRender={[selectedPlan.id, selectedPlan.price]}
          createOrder={createOrder}
          onApprove={(data) => {
            return onApprove(data);
          }}
          onError={onError}
        />
      ) : (
        <div className="text-center py-4">
          Please select a plan to continue.
        </div>
      )}
    </div>
  );
}
