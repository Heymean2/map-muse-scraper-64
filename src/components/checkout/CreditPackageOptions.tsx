
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

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
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, 1000), 10000000);
      setCustomAmount(clampedValue);
      onCreditQuantityChange(clampedValue);
    }
  };
  
  // Format price with discount calculation
  const calculatePrice = (credits: number, basePrice: number): number => {
    // Apply discount based on volume (optional)
    return credits * basePrice;
  };
  
  useEffect(() => {
    // Update local state when prop changes (from URL or parent)
    if (creditQuantity !== customAmount) {
      setCustomAmount(creditQuantity || 1000);
    }
  }, [creditQuantity, customAmount]);

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
            <p className="text-sm font-medium">
              Total: ${calculatePrice(customAmount, creditPrice).toFixed(2)}
            </p>
            <p className="text-sm text-slate-700">
              ${creditPrice.toFixed(5)} per credit × {customAmount.toLocaleString()} credits
            </p>
            <p className="text-xs text-slate-500">
              Each credit allows you to extract 1 row of data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
