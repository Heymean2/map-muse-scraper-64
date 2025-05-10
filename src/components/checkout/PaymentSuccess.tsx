
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PaymentSuccess() {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <CardTitle>Payment Successful</CardTitle>
        </div>
        <CardDescription>
          Your plan has been updated successfully.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">You will be redirected to the dashboard shortly.</p>
        <Button onClick={() => navigate('/dashboard')} className="w-full">
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
