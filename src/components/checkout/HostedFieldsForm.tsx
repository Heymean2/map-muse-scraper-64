
import { useState } from "react";
import { PayPalHostedField, usePayPalHostedFields } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface HostedFieldsFormProps {
  onApprove: (orderData: any) => void;
}

export function HostedFieldsForm({ onApprove }: HostedFieldsFormProps) {
  const { cardFields } = usePayPalHostedFields();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = () => {
    if (!cardFields) {
      toast.error("Card fields are not ready");
      return;
    }

    setIsSubmitting(true);
    
    cardFields.submit({
      cardholderName: document.querySelector<HTMLInputElement>("#card-holder-name")?.value,
    }).then(orderData => {
      onApprove(orderData);
    }).catch(error => {
      console.error("Card payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    }).finally(() => {
      setIsSubmitting(false);
    });
  };
  
  const isFormInvalid = !cardFields;

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="card-holder-name" className="block text-sm font-medium">
            Cardholder Name
          </label>
          <input
            id="card-holder-name"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            type="text"
            placeholder="Name on card"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Card Number</label>
          <div className="border rounded-md px-3 py-2">
            <PayPalHostedField
              id="card-number"
              hostedFieldType="number"
              options={{
                selector: "#card-number",
                placeholder: "Card number"
              }}
              className="w-full bg-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Expiration Date</label>
            <div className="border rounded-md px-3 py-2">
              <PayPalHostedField
                id="expiration-date"
                hostedFieldType="expirationDate"
                options={{
                  selector: "#expiration-date",
                  placeholder: "MM/YY"
                }}
                className="w-full bg-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Security Code</label>
            <div className="border rounded-md px-3 py-2">
              <PayPalHostedField
                id="cvv"
                hostedFieldType="cvv"
                options={{
                  selector: "#cvv",
                  placeholder: "123"
                }}
                className="w-full bg-transparent"
              />
            </div>
          </div>
        </div>
        
        <Button
          onClick={submitHandler}
          disabled={isFormInvalid || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
    </div>
  );
}
