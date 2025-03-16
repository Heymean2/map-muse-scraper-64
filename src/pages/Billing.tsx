
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { checkUserFreeTierLimit } from "@/services/scraper";
import { CircleDollarSign, CheckCircle, CreditCard, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Billing() {
  const { data: usageLimitData, isLoading } = useQuery({
    queryKey: ['userFreeTierLimit'],
    queryFn: checkUserFreeTierLimit
  });

  const calculateUsagePercentage = () => {
    if (!usageLimitData) return 0;
    return Math.min(Math.round((usageLimitData.totalRows / usageLimitData.freeRowsLimit) * 100), 100);
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan and payment details</p>
        </div>
        
        {/* Current plan status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
              <div>
                <h3 className="font-bold text-xl">Free Plan</h3>
                <p className="text-sm text-muted-foreground">Limited to 500 rows of data</p>
              </div>
              <Button>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Data Usage</span>
                <span className="text-sm">
                  {isLoading ? 'Loading...' : `${usageLimitData?.totalRows || 0} / ${usageLimitData?.freeRowsLimit || 500} rows`}
                </span>
              </div>
              <Progress value={calculateUsagePercentage()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {usageLimitData?.isExceeded 
                  ? "You've exceeded the free tier limit. Upgrade to continue accessing all your data."
                  : "You're currently within the free tier limits."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Plan comparison */}
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Free Plan
                <Badge className="ml-2 bg-green-500">Current</Badge>
              </CardTitle>
              <CardDescription>Basic features for personal use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/month</span></p>
              
              <Separator />
              
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Up to 500 rows of data</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Basic data export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Standard processing speed</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <Lock className="h-4 w-4" />
                  <span>Unlimited data storage</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <Lock className="h-4 w-4" />
                  <span>Priority processing</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Current Plan</Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="border-primary/50">
            <CardHeader>
              <div className="bg-primary/5 absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold text-primary">
                RECOMMENDED
              </div>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>Advanced features for power users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold">$19.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
              
              <Separator />
              
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited rows of data</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced data export options</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Priority processing speed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Premium support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced filters & analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </DashboardLayout>
  );
}
