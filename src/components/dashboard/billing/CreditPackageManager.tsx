
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlanInfo } from "@/services/scraper/types";
import { ShoppingCart, CreditCard, TrendingUp } from "lucide-react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Format price with proper precision
  const formatPricePerCredit = (price: number) => {
    if (!price || price < 0.001) return "0.00299";
    return price.toFixed(5).replace(/0+$/, '').replace(/\.$/, '.00');
  };

  const handlePurchase = () => {
    if (creditAmount < 1000) {
      toast.error("Minimum purchase is 1,000 credits");
      return;
    }
    
    // Show processing state
    setIsProcessing(true);
    toast.info("Preparing checkout...");
    
    try {
      // Navigate to checkout page with custom amount and track analytics
      console.log(`Redirecting to checkout with ${creditAmount} credits at ${pricePerCredit} per credit`);
      navigate(`/checkout?planId=credits&planType=credits&creditAmount=${creditAmount}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to proceed to checkout");
      setIsProcessing(false);
    }
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

  // Calculate total price
  const totalPrice = (creditAmount * pricePerCredit).toFixed(2);
  const formattedPricePerCredit = formatPricePerCredit(pricePerCredit);

  // Reset processing state when navigating back
  useEffect(() => {
    return () => setIsProcessing(false);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="bg-slate-50 p-4 border-b border-slate-100">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-google-blue" />
            <span>Credit Package Customizer</span>
          </h3>
          <p className="text-sm text-muted-foreground">Choose the amount of credits you need</p>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="creditAmount" className="text-base font-medium">Credit Amount:</Label>
              <span className="text-lg font-bold text-google-blue">{creditAmount.toLocaleString()}</span>
            </div>
            <div className="flex space-x-4 items-center">
              <span className="text-sm font-medium">1,000</span>
              <Slider 
                id="creditAmount"
                value={[creditAmount]}
                min={1000}
                max={1000000}
                step={1000}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <span className="text-sm font-medium">1M</span>
            </div>
            
            <div className="h-8 bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-google-blue/40 transition-all duration-500"
                style={{ width: `${Math.max(5, Math.min(100, (creditAmount / 10000)))}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customAmount" className="text-base font-medium">Custom Amount</Label>
            <Input
              id="customAmount"
              type="number"
              min={1000}
              max={10000000}
              value={creditAmount}
              onChange={handleInputChange}
              className="w-full border-slate-200 focus:border-google-blue focus:ring-google-blue/20"
            />
          </div>
          
          <div className="bg-primary-subtle p-4 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-600">Price per credit:</p>
              <p className="font-medium text-google-blue">${formattedPricePerCredit}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg">Total:</p>
              <p className="font-bold text-xl text-google-blue">${totalPrice}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-google-green" />
            <p className="font-medium text-lg">Current Credits: <span className="text-google-green">{userPlan?.credits || 0}</span></p>
          </div>
          <p className="text-sm text-muted-foreground">Each credit allows you to extract one row of data</p>
        </div>
        <Button 
          onClick={handlePurchase}
          disabled={isProcessing}
          className="bg-google-blue hover:bg-google-blue/90 text-white gap-2 px-6 rounded-lg hover:shadow-md transition-all"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Purchase Credits
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
