
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper/taskManagement";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, RefreshCw, X } from "lucide-react";
import ResultsContent from "@/components/results/ResultsContent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { formatDistanceToNow } from "date-fns";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ScrapingRequest } from "@/services/scraper/types";
import { toast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Task {
  id: string;
  task_id: string;
  keywords: string;
  created_at: string;
  status: "processing" | "completed" | "failed";
  country?: string;
  states?: string;
}

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [otherTasks, setOtherTasks] = useState<Task[]>([]);
  const [showTasksList, setShowTasksList] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [taskId]);

  // Get the current task's results
  const { 
    data: taskResults,
    isLoading: taskLoading,
    error: taskError,
    refetch: refetchTaskResults
  } = useQuery({
    queryKey: ['scrapingResults', taskId],
    queryFn: () => getScrapingResults(taskId),
    enabled: !!taskId,
  });

  // Get all tasks for the sidebar
  const { data: allTasksData, refetch: refetchAllTasks } = useQuery({
    queryKey: ['allScrapingTasks'],
    queryFn: () => getScrapingResults(),
  });

  // Update otherTasks when allTasksData changes
  useEffect(() => {
    if (allTasksData && 'tasks' in allTasksData && Array.isArray(allTasksData.tasks)) {
      const formattedTasks: Task[] = allTasksData.tasks.map((task: ScrapingRequest) => ({
        id: String(task.task_id), // Ensure ID is string
        task_id: task.task_id,
        keywords: task.keywords,
        created_at: task.created_at,
        status: (task.status as "processing" | "completed" | "failed") || "processing",
        country: task.country,
        states: task.states
      }));
      setOtherTasks(formattedTasks);
    }
  }, [allTasksData]);

  const handleTaskClick = (task: Task) => {
    navigate(`/result/scrape/${task.task_id}`);
    setShowTasksList(false);
  };

  const handleRefresh = () => {
    refetchTaskResults();
    refetchAllTasks();
    toast({
      title: "Refreshing data",
      description: "Getting the latest results for you."
    });
  };

  // Extract task-specific properties safely
  const taskKeywords = taskResults && 'keywords' in taskResults ? taskResults.keywords : 'Task Details';
  const taskCreatedAt = taskResults && 'created_at' in taskResults ? taskResults.created_at : null;
  const searchInfo = taskResults && 'search_info' in taskResults ? taskResults.search_info : null;
  const resultUrl = taskResults && 'result_url' in taskResults ? taskResults.result_url : null;
  const isLimited = taskResults && 'limited' in taskResults ? taskResults.limited : false;
  const currentPlan = taskResults && 'current_plan' in taskResults ? taskResults.current_plan : null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/result">Results</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{searchInfo?.keywords || taskKeywords || "Task Details"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/result')}
              className="hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowTasksList(true)}
              className="md:hidden"
            >
              View All Tasks
            </Button>
            
            {taskCreatedAt && (
              <div className="hidden md:flex items-center text-sm text-slate-500">
                <Clock className="mr-1 h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(taskCreatedAt), { addSuffix: true })}</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {taskLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : taskError ? (
          <div className="p-4 border rounded bg-red-50 text-red-700">
            Error loading task results. Please try again later.
          </div>
        ) : (
          <div className="animate-fade-in">
            <ResultsContent 
              loading={false} 
              error={null} 
              taskId={taskId || null} 
              results={taskResults} 
              exportCSV={() => {
                if (resultUrl) {
                  window.open(resultUrl, '_blank');
                }
              }}
              isLimited={isLimited}
              planInfo={currentPlan}
            />
          </div>
        )}
      </div>
      
      {/* Mobile Tasks Sheet */}
      <Sheet open={showTasksList} onOpenChange={setShowTasksList}>
        <SheetContent side="left" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>All Tasks</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
            {otherTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${
                  task.task_id === taskId ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => handleTaskClick(task)}
              >
                <div className="font-medium">{task.keywords}</div>
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
