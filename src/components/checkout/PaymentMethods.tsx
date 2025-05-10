
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PaymentMethodsProps {
  onPaymentMethodChange: (method: string) => void;
  onCreditCardSubmit: () => void;
  isProcessing: boolean;
  totalAmount: number;
}

export function PaymentMethods({
  onPaymentMethodChange,
  onCreditCardSubmit,
  isProcessing,
  totalAmount
}: PaymentMethodsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    onPaymentMethodChange(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="card" onValueChange={handlePaymentMethodChange} className="space-y-4">
          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-5 w-5" />
              Credit / Debit Card
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="cursor-pointer">
              <span className="font-bold text-blue-600">Pay</span>
              <span className="font-bold text-blue-800">Pal</span>
            </Label>
          </div>
        </RadioGroup>
        
        {paymentMethod === "card" && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <input 
                  id="cardName"
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <input 
                  id="cardNumber"
                  type="text" 
                  placeholder="1234 5678 9012 3456" 
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <input 
                  id="expiry"
                  type="text" 
                  placeholder="MM/YY" 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <input 
                  id="cvc"
                  type="text" 
                  placeholder="123" 
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <Button 
              onClick={onCreditCardSubmit} 
              className="w-full mt-4"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ${totalAmount.toFixed(2)} USD`}
            </Button>
          </div>
        )}
        
        {paymentMethod === "paypal" && (
          <div className="mt-6">
            <div id="paypal-button-container" className="min-h-[150px] flex items-center justify-center">
              <p className="text-center text-muted-foreground">Loading PayPal...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
