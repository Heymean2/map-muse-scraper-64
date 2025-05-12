
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CreditPackageOptionsProps {
  creditPrice: number;
  creditQuantity: number;
  onCreditQuantityChange: (quantity: number) => void;
}

export function CreditPackageOptions({
  creditPrice,
  creditQuantity,
  onCreditQuantityChange
}: CreditPackageOptionsProps) {
  const [customAmount, setCustomAmount] = useState<number>(creditQuantity || 1000);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setCustomAmount(newValue);
    onCreditQuantityChange(newValue);
  };
  
  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value < 1000) {
        toast.error("Minimum purchase is 1,000 credits");
        const clampedValue = 1000;
        setCustomAmount(clampedValue);
        onCreditQuantityChange(clampedValue);
      } else if (value > 10000000) {
        toast.error("Maximum purchase is 10,000,000 credits");
        const clampedValue = 10000000;
        setCustomAmount(clampedValue);
        onCreditQuantityChange(clampedValue);
      } else {
        setCustomAmount(value);
        onCreditQuantityChange(value);
      }
    }
  };
  
  // Format price with NO discount calculation - removed all discount logic
  const calculatePrice = (credits: number, basePrice: number): number => {
    // Make sure we have a valid price, use fallback if needed
    const priceToUse = basePrice > 0.00001 ? basePrice : 0.002;
    
    // No discount applied - straight calculation
    return credits * priceToUse;
  };
  
  // Format the price per credit with consistent precision
  const formatPricePerCredit = (price: number) => {
    // Always display with 5 decimal places for consistency
    return (price || 0.002).toFixed(5);
  };
  
  // Sync local state when prop changes
  useEffect(() => {
    if (creditQuantity !== customAmount && creditQuantity >= 1000) {
      setCustomAmount(creditQuantity);
    }
  }, [creditQuantity, customAmount]);

  // Calculate values - no discount
  const totalPrice = calculatePrice(customAmount, creditPrice);
  const formattedPricePerCredit = formatPricePerCredit(creditPrice);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Choose Credits Amount</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="creditAmount">Credit Amount: {customAmount.toLocaleString()}</Label>
            <div className="flex space-x-4 items-center">
              <span className="text-sm">1,000</span>
              <Slider 
                id="creditAmount"
                value={[customAmount]}
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
              value={customAmount}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                Credits: <span className="font-bold">{customAmount.toLocaleString()}</span>
              </p>
            </div>
            
            <p className="text-sm text-slate-700">
              ${formattedPricePerCredit} per credit × {customAmount.toLocaleString()} credits
            </p>
            
            <div className="border-t border-slate-200 pt-2 mt-2">
              <p className="font-medium text-lg flex justify-between">
                <span>Total:</span> 
                <span className="text-google-blue">${totalPrice.toFixed(2)}</span>
              </p>
            </div>
            
            <p className="text-xs text-slate-500">
              Each credit allows you to extract 1 row of data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
