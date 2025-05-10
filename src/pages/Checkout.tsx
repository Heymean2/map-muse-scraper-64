
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { PlanSelection } from "@/components/checkout/PlanSelection";
import { PlanSummary } from "@/components/checkout/PlanSummary";
import { PaymentSuccess } from "@/components/checkout/PaymentSuccess";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";

export default function Checkout() {
  const {
    isProcessing,
    isSuccess,
    isError,
    errorMessage,
    selectedPlan,
    plansData,
    currentPlanLoading,
    currentPlanError,
    plansLoading,
    setSelectedPlan,
    createOrder,
    captureOrder,
    handlePayPalError
  } = useCheckoutLogic();

  if (currentPlanLoading || plansLoading) {
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

  if (currentPlanError) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {currentPlanError.message || "Failed to load your current plan. Please try again."}
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Back to Dashboard
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  if (isSuccess) {
    return (
      <DashboardLayout>
        <Container className="py-8">
          <PaymentSuccess />
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">Upgrade Your Plan</h1>
        
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {errorMessage || "An error occurred. Please try again."}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select a Plan</CardTitle>
                <CardDescription>Choose a plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                {plansData && plansData.length > 0 ? (
                  <PlanSelection 
                    plans={plansData}
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                  />
                ) : (
                  <p className="text-muted-foreground">No plans available</p>
                )}

                <PaymentForm
                  selectedPlan={selectedPlan}
                  isProcessing={isProcessing}
                  createOrder={createOrder}
                  onApprove={(data) => captureOrder(data.orderID)}
                  onError={handlePayPalError}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <PlanSummary selectedPlan={selectedPlan} />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
