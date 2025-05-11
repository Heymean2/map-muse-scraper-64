import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScraperForm from "@/components/ScraperForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserPlanInfo, getUserScrapingTasks } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  CircleDollarSign, 
  CreditCard, 
  FilePlus2, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  MapPin,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";
import Profile from "@/pages/Profile";
import Results from "@/pages/Results";

function DashboardHome() {
  const navigate = useNavigate();
  
  const { data: planInfo, isLoading: planLoading } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo
  });
  
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['userScrapingTasks'],
    queryFn: getUserScrapingTasks
  });
  
  const completedTasks = tasksData && Array.isArray(tasksData) ? 
    tasksData.filter(task => task.status === 'completed').length : 0;
    
  const processingTasks = tasksData && Array.isArray(tasksData) ? 
    tasksData.filter(task => task.status === 'processing').length : 0;
    
  // Determine plan types
  const isCreditBasedPlan = planInfo?.billing_period === 'credits';
  const isSubscriptionPlan = planInfo?.billing_period === 'monthly' && !planInfo?.isFreePlan;
  const hasBothPlanTypes = planInfo?.hasBothPlanTypes;
  
  return (
    <div className="w-full px-4 md:px-0">
      <div className="mb-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full -z-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-google-red/5 rounded-full -z-10 blur-xl"></div>
        
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="h-8 w-8 text-google-red" />
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Monitor your scraping tasks and usage</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="map-card hover:border-google-blue/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-google-blue/10">
                <CreditCard className="h-4 w-4 text-google-blue" />
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
                    <CreditCard className="h-4 w-4 text-google-yellow" />
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
                  <CreditCard className="h-4 w-4 text-google-yellow" />
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
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/scrape" element={<ScraperForm />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results/*" element={<Results />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
