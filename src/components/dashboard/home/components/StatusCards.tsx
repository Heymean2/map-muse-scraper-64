
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CircleDollarSign, 
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface StatusCardsProps {
  planInfo: any;
  planLoading: boolean;
  completedTasks: number;
  processingTasks: number;
  tasksLoading: boolean;
  isCreditBasedPlan: boolean;
  hasBothPlanTypes: boolean;
  isSubscriptionPlan: boolean;
}

export function StatusCards({
  planInfo,
  planLoading,
  completedTasks,
  processingTasks,
  tasksLoading,
  isCreditBasedPlan,
  hasBothPlanTypes,
  isSubscriptionPlan
}: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="map-card hover:border-google-blue/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-google-blue/10">
              <CircleDollarSign className="h-4 w-4 text-google-blue" />
            </span>
            Usage
          </CardTitle>
          <CardDescription>Subscription status</CardDescription>
        </CardHeader>
        <CardContent>
          {planLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  {planInfo?.planName || "Free Plan"}
                </span>
                {planInfo && (
                  <Badge 
                    variant={isCreditBasedPlan ? "outline" : "secondary"} 
                    className={`text-xs ${isCreditBasedPlan ? "border-google-yellow text-google-yellow" : "bg-google-green text-white"}`}
                  >
                    {isCreditBasedPlan ? "Pay-Per-Use" : planInfo.isFreePlan ? "Free" : "Subscription"}
                  </Badge>
                )}
              </div>
              
              {/* Show credits information for both credit plans and users with both plan types */}
              {(isCreditBasedPlan || hasBothPlanTypes) && planInfo && (
                <div className="text-sm text-muted-foreground flex items-center gap-1 p-2 bg-google-yellow/10 rounded-md">
                  <CircleDollarSign className="h-4 w-4 text-google-yellow" />
                  <span className="font-medium">{planInfo.credits} credits available</span>
                  {planInfo.price_per_credit && (
                    <span className="text-xs">
                      (${planInfo.price_per_credit.toFixed(3)} per row)
                    </span>
                  )}
                </div>
              )}
              
              {/* Show subscription information */}
              {isSubscriptionPlan && (
                <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-google-green/10 rounded-md">
                  <CheckCircle className="h-4 w-4 text-google-green" />
                  <span className="font-medium">Unlimited access with subscription</span>
                </div>
              )}
              
              {/* Show notification for users with both plan types */}
              {hasBothPlanTypes && (
                <div className="mt-2 p-2 bg-google-blue/10 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-google-blue mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-google-blue/80">
                    Your subscription plan will be used first. After your subscription expires, you can use your available credits.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="map-card hover:border-google-green/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-google-green/10">
              <CheckCircle className="h-4 w-4 text-google-green" />
            </span>
            Completed Tasks
          </CardTitle>
          <CardDescription>Finished scraping jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-end gap-2">
              <div className="text-3xl font-bold">{completedTasks}</div>
              <TrendingUp className="h-5 w-5 text-google-green mb-1" />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="map-card hover:border-google-yellow/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-google-yellow/10">
              <AlertCircle className="h-4 w-4 text-google-yellow" />
            </span>
            Processing
          </CardTitle>
          <CardDescription>Tasks in progress</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="text-3xl font-bold">{processingTasks}</div>
          )}
          {processingTasks > 0 && (
            <div className="w-3 h-3 rounded-full bg-google-yellow animate-pulse mt-2"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
