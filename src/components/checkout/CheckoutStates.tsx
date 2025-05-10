
import { Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";

interface CheckoutErrorProps {
  message?: string;
}

export function CheckoutLoading() {
  return (
    <DashboardLayout>
      <Container className="py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    </DashboardLayout>
  );
}

export function CheckoutError({ message }: CheckoutErrorProps) {
  return (
    <DashboardLayout>
      <Container className="py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {message || "Failed to load your current plan. Please try again."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Back to Dashboard
        </Button>
      </Container>
    </DashboardLayout>
  );
}

export function NoPlanSelected() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <Container className="py-8">
        <Alert className="mb-6">
          <AlertDescription>
            No plan selected. Please select a plan from the billing page.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/dashboard/billing')}>
          Back to Plans
        </Button>
      </Container>
    </DashboardLayout>
  );
}

export function CheckoutSuccessState() {
  return (
    <DashboardLayout>
      <Container className="py-8">
        <PaymentSuccess />
      </Container>
    </DashboardLayout>
  );
}
