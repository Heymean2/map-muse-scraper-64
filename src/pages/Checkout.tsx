
import { useState } from "react";
import { Container } from "@/components/ui/container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CheckoutProps {
  planId?: string;
}

interface PlanFeature {
  name: string;
  included: boolean;
}

export default function Checkout({ planId }: CheckoutProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  
  // In a real app, you would fetch this data from your backend
  const plan = {
    id: planId || "pro-monthly",
    name: "Pro Plan",
    price: 29,
    billingPeriod: "monthly",
    features: [
      { name: "Unlimited scraping tasks", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced data analytics", included: true },
      { name: "API access", included: true },
      { name: "Team collaboration", included: false }
    ] as PlanFeature[]
  };
  
  const handleCheckout = () => {
    toast.success("Processing your payment...");
    // In a real app, you would redirect to a payment processor or handle payment here
    setTimeout(() => {
      toast.success("Payment successful!");
      navigate("/dashboard");
    }, 2000);
  };
  
  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="space-y-4">
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
                  </div>
                )}
                
                {paymentMethod === "paypal" && (
                  <div className="mt-6 p-4 bg-gray-50 rounded text-center">
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to PayPal to complete your purchase.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{plan.name}</span>
                  <span>${plan.price}/{plan.billingPeriod}</span>
                </div>
                
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">What's included:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="h-4 w-4 text-gray-300">-</span>
                        )}
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${plan.price}/{plan.billingPeriod}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout} 
                  className="w-full mt-4"
                >
                  Complete Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
