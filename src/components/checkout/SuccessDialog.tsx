
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: string;
  planName?: string;
  totalCredits?: number;
}

export function SuccessDialog({ 
  open, 
  onOpenChange, 
  planType, 
  planName,
  totalCredits 
}: SuccessDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-center mb-6">
            {planType === 'subscription' 
              ? `Your ${planName} subscription has been activated successfully!` 
              : `You have successfully purchased ${totalCredits} credits!`}
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
