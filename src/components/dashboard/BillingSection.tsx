
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserPlanInfo } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function BillingSection() {
  const { data: planInfo, isLoading } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });

  // Calculate progress percentage
  const usagePercentage = planInfo ? Math.min(100, (planInfo.totalRows / planInfo.freeRowsLimit) * 100) : 0;
  const isNearLimit = usagePercentage >= 80 && usagePercentage < 100;
  const isOverLimit = usagePercentage >= 100;

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and payment details</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-primary/10 rounded-lg">
              <h3 className="font-bold text-lg">{isLoading ? 'Loading...' : planInfo?.planName || 'Free Plan'}</h3>
              <p className="text-sm text-muted-foreground">{planInfo?.isFreePlan ? 'Limited to 500 rows total' : 'Unlimited rows'}</p>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Basic scraping capabilities</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Up to {planInfo?.freeRowsLimit || 500} rows of data</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Export to CSV</span>
              </p>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Usage</p>
                <p className="text-sm font-medium">
                  {isLoading ? 'Loading...' : `${planInfo?.totalRows || 0} / ${planInfo?.freeRowsLimit || 500} rows`}
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
                    You've exceeded your free tier limit. Upgrade now to access all your data and continue scraping.
                  </span>
                </div>
              )}
              
              {isNearLimit && !isOverLimit && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    You're approaching your free tier limit. Consider upgrading soon to avoid interruptions.
                  </span>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button variant="default">
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>Unlock all premium features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
              <h3 className="font-bold text-lg">Pro Plan</h3>
              <p className="text-2xl font-bold mt-1">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited scraping capabilities</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited rows of data</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority processing</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced export options</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </p>
            </div>
            
            <Button variant="default" className="w-full">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
