
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScraperForm from "@/components/ScraperForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserPlanInfo, getUserScrapingTasks } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, CreditCard, FilePlus2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";

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
    
  // Determine if the plan is credit-based
  const isCreditBasedPlan = planInfo?.billing_period === 'credits';
  
  return (
    <div className="w-full px-4 md:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your scraping tasks and usage</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <CardDescription>Subscription status</CardDescription>
          </CardHeader>
          <CardContent>
            {planLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {planInfo?.planName || "Free Plan"}
                  </span>
                  {planInfo && (
                    <Badge variant={isCreditBasedPlan ? "outline" : "secondary"} className="text-xs">
                      {isCreditBasedPlan ? "Pay-Per-Use" : planInfo.isFreePlan ? "Free" : "Subscription"}
                    </Badge>
                  )}
                </div>
                {isCreditBasedPlan && planInfo && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>{planInfo.credits} credits available</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CardDescription>Finished scraping jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="text-3xl font-bold">{completedTasks}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <CardDescription>Tasks in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="text-3xl font-bold">{processingTasks}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new task or view results</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/scrape')}
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              New Scraping Task
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/result')}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Results
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{planInfo?.planName || "Free Plan"}</h3>
                {planInfo && (
                  <Badge variant={isCreditBasedPlan ? "outline" : "secondary"} className="text-xs">
                    {isCreditBasedPlan ? "Pay-Per-Use" : planInfo.isFreePlan ? "Free" : "Subscription"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {planInfo?.features?.reviews 
                  ? "Access to all data types including reviews" 
                  : "Basic data access (no reviews)"}
              </p>
              
              {isCreditBasedPlan && planInfo && (
                <div className="mt-2 text-sm flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>{planInfo.credits} credits available (${planInfo.price_per_credit?.toFixed(3)} per row)</span>
                </div>
              )}
            </div>
            <Button 
              variant="default" 
              className="w-full"
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
