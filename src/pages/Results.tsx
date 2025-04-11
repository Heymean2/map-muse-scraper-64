
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { getScrapingResults, getUserScrapingTasks, getUserPlanInfo, updateUserRows } from "@/services/scraper";
import { withDelay, animationClasses } from "@/lib/animations";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import TaskList from "@/components/results/TaskList";
import ResultsContent from "@/components/results/ResultsContent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Results() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [results, setResults] = useState<any>(null);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [freeTierExceeded, setFreeTierExceeded] = useState(false);
  
  // Use React Query for getting usage data
  const { data: userPlanInfo, refetch: refetchPlanInfo } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: getUserPlanInfo,
    enabled: !!user,
    staleTime: 30000 // 30 seconds
  });
  
  // Function to calculate total rows from all user tasks
  const calculateTotalUserRows = useCallback(async () => {
    if (!user) return 0;
    
    try {
      const { data, error } = await supabase
        .from('scraping_requests')
        .select('row_count')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error calculating total rows:", error);
        return 0;
      }
      
      // Sum up all row_count values
      const totalRows = data.reduce((sum, item) => {
        return sum + (item.row_count || 0);
      }, 0);
      
      return totalRows;
    } catch (err) {
      console.error("Error in calculateTotalUserRows:", err);
      return 0;
    }
  }, [user]);
  
  // Function to check if user has exceeded free tier limit
  const checkFreeTierLimit = useCallback(async () => {
    if (!userPlanInfo) return false;
    
    const totalRows = await calculateTotalUserRows();
    
    return userPlanInfo.isFreePlan && totalRows > userPlanInfo.freeRowsLimit;
  }, [userPlanInfo, calculateTotalUserRows]);
  
  const fetchResults = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First check if user has exceeded free tier
      if (!userPlanInfo) {
        await refetchPlanInfo();
      }
      
      const data = await getScrapingResults(taskId || undefined);
      setResults(data);
      
      // Check if we need to update the user's total row count
      if (data?.status === "completed" && data?.total_count && !data?.row_count_updated) {
        await updateUserRows(data.total_count);
        data.row_count_updated = true;
      }
      
      // Check if user has exceeded free tier limit
      const isLimitExceeded = await checkFreeTierLimit();
      setFreeTierExceeded(isLimitExceeded);
      
    } catch (err) {
      setError("Failed to fetch results. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserTasks = async () => {
    if (!user) return;
    
    setTasksLoading(true);
    try {
      const tasks = await getUserScrapingTasks();
      setUserTasks(tasks);
    } catch (err) {
      console.error("Error fetching user tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };
  
  useEffect(() => {
    if (!user) return;
    
    fetchResults();
    fetchUserTasks();
    
    // Check free tier limit on initial load
    checkFreeTierLimit().then(setFreeTierExceeded);
    
    // Auto refresh every 30 seconds if processing
    const intervalId = setInterval(() => {
      if (results?.status === "processing") {
        fetchResults();
        fetchUserTasks();
        refetchPlanInfo();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [taskId, user, checkFreeTierLimit]);
  
  const handleTaskClick = (task: any) => {
    window.history.pushState({}, '', `/result?task_id=${task.task_id}`);
    window.dispatchEvent(new Event('popstate'));
    fetchResults();
  };
  
  const handleExportCSV = () => {
    if (!results?.data) return;
    
    if (freeTierExceeded) {
      toast({
        title: "Upgrade Required",
        description: "Please upgrade your plan to export full data",
        variant: "destructive",
      });
      return;
    }
    
    // Convert results to CSV
    const headers = Object.keys(results.data[0] || {}).join(',');
    const csvRows = results.data.map((row: any) => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scraping-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Scraping Results
          </h1>
          
          {taskId && (
            <p className={`text-sm text-slate-600 dark:text-slate-400 ${withDelay(animationClasses.slideUp, 200)}`}>
              Task ID: {taskId}
            </p>
          )}
        </div>
        
        {freeTierExceeded && results?.data?.length > 0 && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <Lock className="h-4 w-4" />
                Limited Preview
              </CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-500">
                You've exceeded the free tier limit of {userPlanInfo?.freeRowsLimit || 500} rows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-4">
                Currently showing only 5 rows out of {results.total_count}. Upgrade your plan to access all data.
              </p>
              <Button onClick={() => window.location.href = '/dashboard/billing'}>Upgrade Now</Button>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TaskList 
            userTasks={userTasks}
            tasksLoading={tasksLoading}
            currentTaskId={taskId}
            onTaskClick={handleTaskClick}
          />
          
          <ResultsContent 
            loading={loading}
            error={error}
            taskId={taskId}
            results={results}
            exportCSV={handleExportCSV}
            isLimited={freeTierExceeded}
            planInfo={userPlanInfo}
          />
        </div>
      </Container>
    </DashboardLayout>
  );
}
