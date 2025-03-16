
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkUserFreeTierLimit } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, CheckCircle } from "lucide-react";

export default function BillingSection() {
  const { data: usageLimitData, isLoading } = useQuery({
    queryKey: ['userFreeTierLimit'],
    queryFn: checkUserFreeTierLimit
  });

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
              <h3 className="font-bold text-lg">Free Plan</h3>
              <p className="text-sm text-muted-foreground">Limited to 500 rows total</p>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Basic scraping capabilities</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Up to 500 rows of data</span>
              </p>
              <p className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Export to CSV</span>
              </p>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-medium">Usage</p>
                <p className="text-xs text-muted-foreground">
                  {isLoading ? 'Loading...' : `${usageLimitData?.totalRows || 0} / ${usageLimitData?.freeRowsLimit || 500} rows used`}
                </p>
              </div>
              <Button variant="default">
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
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
            </div>
            
            <Button variant="outline" className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
