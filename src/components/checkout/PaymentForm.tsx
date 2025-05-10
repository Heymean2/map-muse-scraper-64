import { useState, useEffect } from "react";
import { 
  PayPalButtons,
  PayPalHostedFieldsProvider,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
  DISPATCH_ACTION
} from "@paypal/react-paypal-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HostedFieldsForm } from "./HostedFieldsForm";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentFormProps {
  selectedPlan: any;
  isProcessing: boolean;
  clientToken: string | null;
  createOrder: () => Promise<any>;
  onApprove: (data: any) => Promise<void>;
  onError: (err: any) => void;
}

export function PaymentForm({
  selectedPlan,
  isProcessing,
  clientToken,
  createOrder,
  onApprove,
  onError
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [{ isPending, isResolved, isRejected }, dispatch] = usePayPalScriptReducer();

  // Update the PayPal script with client token when needed for hosted fields
  useEffect(() => {
    if (paymentMethod === "card" && clientToken) {
      // First set loading state to pending before updating options
      dispatch({
        type: DISPATCH_ACTION.LOADING_STATUS,
        value: SCRIPT_LOADING_STATE.PENDING
      });
      
      // Then set the options
      dispatch({
        type: DISPATCH_ACTION.RESET_OPTIONS,
        value: {
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
          components: "buttons,hosted-fields",
          currency: "USD",
          intent: "capture",
          "data-client-token": clientToken
        },
      });
    }
  }, [paymentMethod, clientToken, dispatch]);

  if (isPending && paymentMethod === "card") {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading payment form...</p>
      </div>
    );
  }

  if (isRejected && paymentMethod === "card") {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>
          Failed to load payment form. Please try refreshing the page or use PayPal checkout instead.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="paypal" onValueChange={(v) => setPaymentMethod(v as "paypal" | "card")}>
      <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
        <TabsTrigger value="paypal">PayPal</TabsTrigger>
        <TabsTrigger value="card">Credit Card</TabsTrigger>
      </TabsList>
      
      <TabsContent value="paypal" className="mt-6">
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
      </TabsContent>
      
      <TabsContent value="card" className="mt-6">
        {selectedPlan ? (
          isResolved && paymentMethod === "card" ? (
            <PayPalHostedFieldsProvider
              createOrder={createOrder}
            >
              <HostedFieldsForm 
                onApprove={onApprove} 
                onError={onError}
              />
            </PayPalHostedFieldsProvider>
          ) : (
            <div className="text-center py-4">
              Loading credit card form...
            </div>
          )
        ) : (
          <div className="text-center py-4">
            Please select a plan to continue.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
