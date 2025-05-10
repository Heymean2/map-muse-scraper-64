
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Credit Package Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creditPackages">Select Package Size</Label>
            <select
              id="creditPackages"
              className="w-full p-2 border rounded"
              value={creditQuantity}
              onChange={(e) => onCreditQuantityChange(parseInt(e.target.value))}
            >
              <option value="1">1,000 credits (${(1000 * creditPrice).toFixed(2)})</option>
              <option value="5">5,000 credits - 5% discount (${(5000 * creditPrice * 0.95).toFixed(2)})</option>
              <option value="10">10,000 credits - 10% discount (${(10000 * creditPrice * 0.9).toFixed(2)})</option>
              <option value="25">25,000 credits - 15% discount (${(25000 * creditPrice * 0.85).toFixed(2)})</option>
            </select>
          </div>
          <div className="bg-slate-50 p-4 rounded-md">
            <p className="text-sm text-slate-700">
              Each credit allows you to extract 1 row of data. Larger packages offer better value with volume discounts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
