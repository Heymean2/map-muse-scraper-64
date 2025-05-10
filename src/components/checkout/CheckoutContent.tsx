
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreditPackageOptions } from "@/components/checkout/CreditPackageOptions";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { PlanSummary } from "@/components/checkout/PlanSummary";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface CheckoutContentProps {
  planType: string;
  selectedPlan: any;
  creditAmount: number;
  creditPrice: number;
  isError: boolean;
  errorMessage: string;
  isProcessing: boolean;
  onCreditAmountChange: (amount: number) => void;
  createOrder: () => Promise<any>;
  captureOrder: (orderID: string) => Promise<void>;
  handlePayPalError: (err: any) => void;
}

export function CheckoutContent({
  planType,
  selectedPlan,
  creditAmount,
  creditPrice,
  isError,
  errorMessage,
  isProcessing,
  onCreditAmountChange,
  createOrder,
  captureOrder,
  handlePayPalError
}: CheckoutContentProps) {
  const navigate = useNavigate();
  const pageTitle = planType === 'credits' ? 'Purchase Credits' : 'Upgrade Your Plan';

  return (
    <DashboardLayout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
        
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
                <CardTitle>
                  {planType === 'credits' ? 'Selected Credit Package' : 'Selected Plan'}
                </CardTitle>
                <CardDescription>
                  {planType === 'credits' ? 'Purchase credits for data extraction' : selectedPlan?.name}
                </CardDescription>
                <Button 
                  variant="ghost" 
                  className="mt-2 pl-0" 
                  onClick={() => navigate('/dashboard/billing')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to plans
                </Button>
              </CardHeader>
              <CardContent>
                {planType === 'credits' && (
                  <CreditPackageOptions 
                    creditPrice={selectedPlan.price_per_credit || creditPrice}
                    creditQuantity={creditAmount}
                    onCreditQuantityChange={onCreditAmountChange}
                  />
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
            <PlanSummary 
              selectedPlan={selectedPlan} 
              customCredits={planType === 'credits' ? creditAmount : undefined}
              creditPrice={selectedPlan.price_per_credit || creditPrice}
            />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
