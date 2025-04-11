
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { getScrapingResults, getUserScrapingTasks, getUserPlanInfo, updateUserRows } from "@/services/scraper";
import { withDelay, animationClasses } from "@/lib/animations";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ResultsContent from "@/components/results/ResultsContent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Results() {
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<any>(null);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [freeTierExceeded, setFreeTierExceeded] = useState(false);
  
  // Use React Query for getting usage data
  const [userPlanInfo, setUserPlanInfo] = useState<any>(null);
  
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
  
  const fetchResults = async (id?: string) => {
    if (!user) return;
    
    if (!id && !taskId) {
      setResults(null);
      return;
    }
    
    const taskToFetch = id || taskId;
    
    setLoading(true);
    setError(null);
    
    try {
      const planInfo = await getUserPlanInfo();
      setUserPlanInfo(planInfo);
      
      const data = await getScrapingResults(taskToFetch || undefined);
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
    
    fetchUserTasks();
    
    if (taskId) {
      fetchResults();
    }
    
    // Auto refresh every 30 seconds if processing
    const intervalId = setInterval(() => {
      if (results?.status === "processing") {
        fetchResults();
        fetchUserTasks();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [taskId, user]);
  
  const handleTaskClick = (taskId: string) => {
    setSearchParams({ task_id: taskId });
    fetchResults(taskId);
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

  // Get task status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Scraping Results
          </h1>
        </div>
        
        {/* All Tasks Table */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Your Scraping Tasks</h2>
              <p className="text-sm text-muted-foreground">Click on a task to view its results</p>
            </div>
            
            {tasksLoading ? (
              <div className="p-8 text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto animate-spin mb-2" />
                <p>Loading your tasks...</p>
              </div>
            ) : userTasks.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  You haven't created any scraping tasks yet.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/dashboard")}
                >
                  Create New Task
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keywords</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTasks.map((task) => (
                      <TableRow 
                        key={task.id}
                        className={task.task_id === taskId ? "bg-primary/5" : ""}
                      >
                        <TableCell className="font-medium">{task.keywords}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(task.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleTaskClick(task.task_id)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
        
        {/* Selected Task Results */}
        {taskId && (
          <div className="mb-8">
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
        )}
      </Container>
    </DashboardLayout>
  );
}
