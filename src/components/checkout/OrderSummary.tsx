
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPlanFeatures } from "@/components/dashboard/billing/PlanFeatures";

interface OrderSummaryProps {
  planData: any;
  planLoading: boolean;
  planType: string;
  totalAmount: number;
  totalCredits?: number;
}

export function OrderSummary({ 
  planData,
  planLoading,
  planType,
  totalAmount,
  totalCredits 
}: OrderSummaryProps) {
  const navigate = useNavigate();
  const planFeatures = planData ? getPlanFeatures(planData.name) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {planLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="font-medium">{planData?.name}</span>
              {planType === 'subscription' ? (
                <span>${planData?.price}/{planData?.billing_period}</span>
              ) : (
                <span>${totalAmount.toFixed(2)} for {totalCredits} credits</span>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium">What's included:</p>
              <ul className="space-y-2">
                {planFeatures.map((feature, index) => (
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
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
        
        <Button 
          onClick={() => navigate('/dashboard/billing')} 
          variant="outline"
          className="w-full mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      </CardContent>
    </Card>
  );
}
