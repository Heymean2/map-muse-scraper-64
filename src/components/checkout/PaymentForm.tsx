
import { useState } from "react";
import { 
  PayPalButtons,
  PayPalHostedFieldsProvider
} from "@paypal/react-paypal-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HostedFieldsForm } from "./HostedFieldsForm";

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
        {selectedPlan && clientToken ? (
          <PayPalHostedFieldsProvider
            createOrder={createOrder}
            clientToken={clientToken}
          >
            <HostedFieldsForm 
              onApprove={(orderData) => onApprove(orderData)} 
            />
          </PayPalHostedFieldsProvider>
        ) : (
          <div className="text-center py-4">
            {!selectedPlan ? "Please select a plan to continue." : "Loading payment form..."}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
