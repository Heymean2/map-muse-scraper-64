
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanSummaryProps {
  selectedPlan: any;
}

export function PlanSummary({ selectedPlan }: PlanSummaryProps) {
  if (!selectedPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No plan selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span>Plan:</span>
          <span className="font-medium">{selectedPlan.name}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Billing Period:</span>
          <span>{selectedPlan.billing_period}</span>
        </div>
        <div className="border-t my-4 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${selectedPlan.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
