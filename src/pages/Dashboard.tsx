import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScraperForm from "@/components/ScraperForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkUserFreeTierLimit, getUserScrapingTasks } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, FilePlus2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Settings from "@/pages/Settings";
import BillingSection from "@/components/dashboard/BillingSection";

function DashboardHome() {
  const navigate = useNavigate();
  
  const { data: usageLimitData, isLoading: usageLoading } = useQuery({
    queryKey: ['userFreeTierLimit'],
    queryFn: checkUserFreeTierLimit
  });
  
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['userScrapingTasks'],
    queryFn: getUserScrapingTasks
  });
  
  const completedTasks = tasksData?.filter(task => task.status === 'completed')?.length || 0;
  const processingTasks = tasksData?.filter(task => task.status === 'processing')?.length || 0;
  
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your scraping tasks and usage</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
            <CardDescription>Usage count</CardDescription>
          </CardHeader>
          <CardContent>
            {usageLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{usageLimitData?.totalRows || 0}</span>
                <span className="text-muted-foreground">/ {usageLimitData?.freeRowsLimit || 500}</span>
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
              <h3 className="font-semibold">Free Plan</h3>
              <p className="text-sm text-muted-foreground">Limited to 500 rows total</p>
            </div>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => navigate('/dashboard/billing')}
            >
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default function Dashboard() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/scrape" element={<ScraperForm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billing" element={<BillingSection />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
