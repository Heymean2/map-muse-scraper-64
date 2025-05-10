
import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsUpgradePromptProps {
  areReviewsRestricted: boolean;
}

export default function ResultsUpgradePrompt({ areReviewsRestricted }: ResultsUpgradePromptProps) {
  const navigate = useNavigate();
  
  if (!areReviewsRestricted) {
    return null;
  }
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-center">
      <p className="text-amber-700 mb-2">Reviews data is restricted. Upgrade to the Pro plan for full access.</p>
      <Button 
        variant="default" 
        size="sm"
        className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        onClick={() => navigate('/dashboard/billing')}
      >
        <Trophy size={14} />
        <span>Upgrade to Pro</span>
      </Button>
    </div>
  );
}
