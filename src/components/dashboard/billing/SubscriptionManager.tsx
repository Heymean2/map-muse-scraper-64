
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SubscriptionManagerProps {
  selectedPlanId: string | null;
  isActivePlan: boolean;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export function SubscriptionManager({ 
  selectedPlanId, 
  isActivePlan,
  isProcessing, 
  setIsProcessing 
}: SubscriptionManagerProps) {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }
    
    // Navigate to checkout page with plan ID as string (query parameter)
    navigate(`/checkout?planId=${selectedPlanId}&planType=subscription`);
  };

  if (!selectedPlanId || isActivePlan) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center">
      <Button 
        size="lg" 
        onClick={handleSubscribe}
        disabled={isProcessing}
        className="gap-2"
      >
        <CircleDollarSign className="h-4 w-4" />
        {isProcessing ? "Processing..." : "Subscribe Now"}
      </Button>
    </div>
  );
}
