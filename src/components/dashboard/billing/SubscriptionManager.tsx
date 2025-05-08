
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import { toast } from "sonner";
import { subscribeToPlan } from "@/services/scraper";

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
  const handleSubscribe = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would connect to Stripe
      // and handle the subscription process
      const result = await subscribeToPlan(selectedPlanId);
      
      if (result.success) {
        toast.success("Subscription updated successfully!");
      } else {
        toast.error(result.error || "Failed to update subscription");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Failed to process your subscription");
    } finally {
      setIsProcessing(false);
    }
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
