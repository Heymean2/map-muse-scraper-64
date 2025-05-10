
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlanInfo } from "@/services/scraper/types";
import { CreditCard, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CreditPackageProps {
  pricePerCredit: number;
  userPlan?: UserPlanInfo;
}

export function CreditPackageManager({ pricePerCredit, userPlan }: CreditPackageProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const navigate = useNavigate();

  const packages = [
    { id: 1, credits: 1000, discount: 0, label: "1,000 Credits" },
    { id: 5, credits: 5000, discount: 0.05, label: "5,000 Credits - 5% discount" },
    { id: 10, credits: 10000, discount: 0.10, label: "10,000 Credits - 10% discount" },
    { id: 25, credits: 25000, discount: 0.15, label: "25,000 Credits - 15% discount" }
  ];

  const calculatePrice = (credits: number, discount: number) => {
    return (credits * pricePerCredit * (1 - discount)).toFixed(2);
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      toast.error("Please select a credit package");
      return;
    }
    
    // Navigate to checkout page
    navigate(`/checkout?planId=credits&planType=credits&packageSize=${selectedPackage}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`cursor-pointer transition-colors ${
              selectedPackage === pkg.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="font-bold">{pkg.label}</div>
                <div className="text-2xl font-semibold">${calculatePrice(pkg.credits, pkg.discount)}</div>
                <div className="text-xs text-muted-foreground">
                  ${(pricePerCredit * (1 - pkg.discount)).toFixed(3)} per credit
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-md">
        <div>
          <p className="font-medium">Current Credits: {userPlan?.credits || 0}</p>
          <p className="text-sm text-muted-foreground">Each credit allows you to extract one row of data</p>
        </div>
        <Button 
          onClick={handlePurchase}
          disabled={selectedPackage === null}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Purchase Credits
        </Button>
      </div>
    </div>
  );
}
