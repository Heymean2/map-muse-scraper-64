
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlanInfo } from "@/services/scraper/types";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreditPackageProps {
  pricePerCredit: number;
  userPlan?: UserPlanInfo;
}

export function CreditPackageManager({ pricePerCredit, userPlan }: CreditPackageProps) {
  const [creditAmount, setCreditAmount] = useState<number>(1000);
  const navigate = useNavigate();

  const handlePurchase = () => {
    if (creditAmount < 1000) {
      toast.error("Minimum purchase is 1,000 credits");
      return;
    }
    
    // Navigate to checkout page with custom amount
    navigate(`/checkout?planId=credits&planType=credits&creditAmount=${creditAmount}`);
  };
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setCreditAmount(value[0]);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, 1000), 10000000);
      setCreditAmount(clampedValue);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="p-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="creditAmount">Credit Amount: {creditAmount.toLocaleString()}</Label>
            <div className="flex space-x-4 items-center">
              <span className="text-sm">1,000</span>
              <Slider 
                id="creditAmount"
                value={[creditAmount]}
                min={1000}
                max={1000000}
                step={1000}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <span className="text-sm">1M</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customAmount">Custom Amount</Label>
            <Input
              id="customAmount"
              type="number"
              min={1000}
              max={10000000}
              value={creditAmount}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <p className="font-medium">
              Total: ${(creditAmount * pricePerCredit).toFixed(2)}
            </p>
            <p className="text-sm text-slate-700">
              ${pricePerCredit.toFixed(3)} per credit × {creditAmount.toLocaleString()} credits
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-md">
        <div>
          <p className="font-medium">Current Credits: {userPlan?.credits || 0}</p>
          <p className="text-sm text-muted-foreground">Each credit allows you to extract one row of data</p>
        </div>
        <Button 
          onClick={handlePurchase}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Purchase Credits
        </Button>
      </div>
    </div>
  );
}
