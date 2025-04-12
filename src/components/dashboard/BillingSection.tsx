
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserPlanInfo } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, CheckCircle, AlertCircle, Plus, Minus, ShoppingCart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function BillingSection() {
  const [creditPackages, setCreditPackages] = useState(1);
  
  // Get user plan info
  const { data: planInfo, isLoading } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });
  
  // Get available credit packages
  const { data: creditPackageData } = useQuery({
    queryKey: ['creditPackages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('name', 'Credit Package')
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  // Calculate progress percentage
  const usagePercentage = planInfo ? Math.min(100, (planInfo.totalRows / planInfo.freeRowsLimit) * 100) : 0;
  const isNearLimit = usagePercentage >= 80 && usagePercentage < 100;
  const isOverLimit = usagePercentage >= 100;
  
  const handleIncrementPackages = () => {
    setCreditPackages(prev => prev + 1);
  };
  
  const handleDecrementPackages = () => {
    setCreditPackages(prev => Math.max(1, prev - 1));
  };
  
  const handlePurchaseCredits = () => {
    // This would connect to a payment processor in a real app
    toast.success(`Purchase of ${creditPackages * 1000} credits initiated`, {
      description: "This would connect to a payment processor in a real application."
    });
  };

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and payment details</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Credits</CardTitle>
            <CardDescription>Your available usage credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="mb-4 p-4 bg-primary/10 rounded-lg">
              <h3 className="font-bold text-lg">{isLoading ? 'Loading...' : planInfo?.planName || 'Free Plan'}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold">{planInfo?.credits || 0}</span>
                <span className="text-muted-foreground">credits available</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>1 credit = 1 row of scraped data</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Purchase credits at any time</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Credits never expire</span>
              </p>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Usage</p>
                <p className="text-sm font-medium">
                  {isLoading ? 'Loading...' : `${planInfo?.totalRows || 0} rows used`}
                </p>
              </div>
              
              <Progress 
                value={usagePercentage} 
                className={`h-2 ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-slate-100'}`}
              />
              
              {isOverLimit && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded border border-red-200 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    You've used all your free credits. Purchase more credits to continue scraping.
                  </span>
                </div>
              )}
              
              {isNearLimit && !isOverLimit && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    You're running low on credits. Consider purchasing more soon.
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase Credits</CardTitle>
            <CardDescription>Buy more credits to continue scraping</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
              <h3 className="font-bold text-lg">Credit Package</h3>
              <p className="text-2xl font-bold mt-1">
                ${creditPackageData?.price || 2.99}
                <span className="text-sm font-normal text-muted-foreground"> per 1,000 credits</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                (${((creditPackageData?.price_per_credit || 0.00299) * 100).toFixed(2)}¢ per credit)
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Number of packages:</label>
              <div className="flex items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDecrementPackages}
                  disabled={creditPackages <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-xl font-bold">{creditPackages}</span>
                  <span className="text-sm text-muted-foreground"> × 1,000 credits</span>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleIncrementPackages}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pb-4 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Credits:</span>
                <span className="font-bold">{creditPackages * 1000} credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="font-bold">${(creditPackages * (creditPackageData?.price || 2.99)).toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              variant="default" 
              className="w-full"
              onClick={handlePurchaseCredits}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchase Credits
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
