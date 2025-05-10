
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CircleDollarSign, CreditCard } from "lucide-react";
import { purchaseCredits } from "@/services/scraper";
import { UserPlanInfo } from "@/services/scraper/types";

interface CreditPackageManagerProps {
  pricePerCredit: number;
  userPlan?: UserPlanInfo;
}

const CREDIT_PACKAGES = [
  { amount: 1000, discount: 0 },
  { amount: 5000, discount: 0.05 },
  { amount: 10000, discount: 0.1 },
  { amount: 25000, discount: 0.15 },
];

export function CreditPackageManager({ pricePerCredit, userPlan }: CreditPackageManagerProps) {
  const [creditAmount, setCreditAmount] = useState(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Find the appropriate package discount
  const getDiscount = (amount: number) => {
    const package_ = CREDIT_PACKAGES.find(pkg => pkg.amount === amount) || { discount: 0 };
    return package_.discount;
  };
  
  const discount = getDiscount(creditAmount);
  const basePrice = (creditAmount * pricePerCredit);
  const discountAmount = basePrice * discount;
  const finalPrice = basePrice - discountAmount;
  
  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Calculate how many "packages" based on 1000 credits per package
      const packageCount = creditAmount / 1000;
      
      // Call the backend to process the credit purchase
      const success = await purchaseCredits(packageCount);
      
      if (success) {
        toast.success(`Successfully purchased ${creditAmount.toLocaleString()} credits!`);
      } else {
        toast.error("Failed to process your purchase. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("An error occurred while processing your purchase");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
        <CardDescription>Buy credits in bulk and save. Credits never expire.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span>Current Credits:</span>
            <span className="font-semibold">{userPlan?.credits?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Credit Value:</span>
            <span className="font-semibold">${pricePerCredit.toFixed(3)} per credit</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Credit Amount:</label>
          <div className="flex items-center gap-4">
            <Slider 
              value={[creditAmount]} 
              min={1000}
              max={25000}
              step={1000}
              onValueChange={(values) => setCreditAmount(values[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={creditAmount}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1000 && val <= 25000) {
                  setCreditAmount(val);
                }
              }}
              className="w-24"
            />
          </div>
          
          {/* Credit packages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <Button 
                key={pkg.amount} 
                variant={creditAmount === pkg.amount ? "default" : "outline"} 
                size="sm"
                onClick={() => setCreditAmount(pkg.amount)}
                className="w-full"
              >
                {pkg.amount.toLocaleString()}
                {pkg.discount > 0 && <span className="text-xs ml-1">(-{pkg.discount * 100}%)</span>}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between text-sm">
            <span>Base Price:</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Volume Discount:</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
            <span>Total:</span>
            <span>${finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button
          className="w-full sm:w-auto flex-1"
          size="lg"
          onClick={handlePurchase}
          disabled={isProcessing}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Purchase Credits"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full sm:w-auto flex-1"
          size="lg"
          disabled={isProcessing}
        >
          <CircleDollarSign className="mr-2 h-4 w-4" />
          Contact Sales
        </Button>
      </CardFooter>
    </Card>
  );
}
