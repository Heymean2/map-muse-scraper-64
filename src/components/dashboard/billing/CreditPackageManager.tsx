
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
import { useTransactionHistory } from "./hooks/useTransactionHistory";

interface CreditPackageProps {
  pricePerCredit: number;
  userPlan?: UserPlanInfo;
}

export function CreditPackageManager({ pricePerCredit, userPlan }: CreditPackageProps) {
  const [creditAmount, setCreditAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  // Use the transaction hook to get current credits
  const { currentCredits, isLoading: creditsLoading } = useTransactionHistory(1);

  // Format price with proper precision
  const formatPricePerCredit = (price: number) => {
    if (!price || price < 0.001) return "0.002";
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

  // Calculate total price - no discount applied
  const totalPrice = (creditAmount * pricePerCredit).toFixed(2);
  const formattedPricePerCredit = formatPricePerCredit(pricePerCredit);

  // Reset processing state when navigating back
  useEffect(() => {
    return () => setIsProcessing(false);
  }, []);

  // Calculate the percentage for the progress bar - improved logarithmic calculation
  const calculateProgressWidth = () => {
    // Min and max credit values
    const minCredits = 1000;
    const maxCredits = 1000000;
    
    // Use logarithmic scale for better visualization
    // This creates a more gradual progression at lower values and still shows 
    // meaningful changes at higher values
    
    // Calculate normalized position (0-1)
    const normalizedValue = Math.log(creditAmount) - Math.log(minCredits);
    const normalizedMax = Math.log(maxCredits) - Math.log(minCredits);
    const percentage = (normalizedValue / normalizedMax) * 100;
    
    // Clamp between 5% and 100%
    return `${Math.max(5, Math.min(100, percentage))}%`;
  };

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
                className="h-full bg-gradient-to-r from-blue-400 to-violet-500 transition-all duration-500"
                style={{ width: calculateProgressWidth() }}
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
          
          <div className="bg-primary-subtle p-4 rounded-xl space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-600">Price per credit:</p>
                <p className="font-medium text-google-blue">${formattedPricePerCredit}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">Total:</p>
                <p className="font-bold text-xl text-google-blue">${totalPrice}</p>
              </div>
            </div>
            
            <Button 
              onClick={handlePurchase}
              disabled={isProcessing}
              className="bg-violet-primary hover:bg-violet-primary/90 text-white gap-2 w-full py-2 rounded-lg hover:shadow-md transition-all"
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
        </CardContent>
      </Card>

      <div className="flex items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-google-green" />
            <p className="font-medium text-lg">
              Current Credits: <span className="text-google-green">{creditsLoading ? "Loading..." : currentCredits.toLocaleString()}</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Each credit allows you to extract one row of data</p>
        </div>
      </div>
    </div>
  );
}
