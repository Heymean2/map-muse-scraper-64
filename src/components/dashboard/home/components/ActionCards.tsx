
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CircleDollarSign,
  MapPin, 
  FilePlus2,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ActionCardsProps {
  planInfo: any;
  isCreditBasedPlan: boolean;
  isSubscriptionPlan: boolean;
  hasBothPlanTypes: boolean;
}

export function ActionCards({
  planInfo,
  isCreditBasedPlan,
  isSubscriptionPlan,
  hasBothPlanTypes
}: ActionCardsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="map-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-google-blue/5 to-google-green/5">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-google-red" />
            Quick Actions
          </CardTitle>
          <CardDescription>Start a new task or view results</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-6">
          <Button 
            variant="outline" 
            className="w-full justify-start group hover:border-google-blue hover:bg-google-blue/5"
            onClick={() => navigate('/dashboard/scrape')}
          >
            <FilePlus2 className="mr-2 h-4 w-4 text-google-blue group-hover:scale-110 transition-transform" />
            New Scraping Task
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start group hover:border-google-green hover:bg-google-green/5"
            onClick={() => navigate('/dashboard/results')}
          >
            <FileText className="mr-2 h-4 w-4 text-google-green group-hover:scale-110 transition-transform" />
            View Results
          </Button>
        </CardContent>
      </Card>
      
      <Card className="map-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-google-yellow/5 to-google-red/5">
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-google-blue" />
            Subscription
          </CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{planInfo?.planName || "Free Plan"}</h3>
              {planInfo && (
                <Badge 
                  variant={isCreditBasedPlan ? "outline" : "secondary"} 
                  className={`text-xs ${isCreditBasedPlan ? "border-google-yellow text-google-yellow" : "bg-google-green text-white"}`}
                >
                  {isCreditBasedPlan ? "Pay-Per-Use" : planInfo.isFreePlan ? "Free" : "Subscription"}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {planInfo?.features?.reviews 
                ? "Access to all data types including reviews" 
                : "Basic data access (no reviews)"}
            </p>
            
            {/* Show credit information */}
            {(isCreditBasedPlan || hasBothPlanTypes) && planInfo && (
              <div className="mt-2 p-2 bg-google-yellow/10 rounded-md flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-google-yellow" />
                <div>
                  <span className="font-medium">{planInfo.credits} credits available</span>
                  {planInfo.price_per_credit && (
                    <div className="text-xs text-muted-foreground">
                      ${planInfo.price_per_credit.toFixed(3)} per row
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Notification for users with both plan types */}
            {hasBothPlanTypes && (
              <div className="mt-3 p-2 bg-google-blue/10 rounded-md flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-google-blue mt-0.5 flex-shrink-0" />
                <p className="text-xs text-google-blue/80">
                  You have both a subscription and credits. Your subscription will be used first, and your credits will be available after your subscription expires.
                </p>
              </div>
            )}
          </div>
          <Button 
            variant="default" 
            className="w-full bg-google-blue hover:bg-google-blue/90 transition-colors"
            onClick={() => navigate('/dashboard/billing')}
          >
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
