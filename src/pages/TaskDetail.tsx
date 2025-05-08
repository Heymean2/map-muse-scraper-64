
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Clock } from "lucide-react";
import ResultsContent from "@/components/results/ResultsContent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TaskList from "@/components/results/TaskList";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [otherTasks, setOtherTasks] = useState([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get the current task's results
  const { 
    data: taskResults,
    isLoading: taskLoading,
    error: taskError 
  } = useQuery({
    queryKey: ['scrapingResults', taskId],
    queryFn: () => getScrapingResults(taskId),
    enabled: !!taskId,
  });

  // Get all tasks for the sidebar
  const { data: allTasksData } = useQuery({
    queryKey: ['allScrapingTasks'],
    queryFn: () => getScrapingResults(),
    onSettled: (data) => {
      if (data?.tasks) {
        const formattedTasks = data.tasks.map((task: any) => ({
          id: task.id || task.task_id,
          task_id: task.task_id,
          keywords: task.keywords || 'Untitled Task',
          created_at: task.created_at,
          status: task.status,
        }));
        setOtherTasks(formattedTasks);
      }
    }
  });

  const handleTaskClick = (task: any) => {
    navigate(`/result/scrape/${task.task_id}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row h-full">
        {/* Left sidebar with task list */}
        <div className="w-full md:w-80 flex-shrink-0 border-r">
          <TaskList 
            userTasks={otherTasks}
            tasksLoading={!allTasksData}
            currentTaskId={taskId || null}
            onTaskClick={handleTaskClick}
          />
        </div>

        {/* Main content area */}
        <div className="flex-grow p-6 overflow-y-auto">
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
                <BreadcrumbPage>{taskResults?.search_info?.keywords || "Task Details"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/result')}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
            
            {taskResults?.created_at && (
              <div className="flex items-center text-sm text-slate-500">
                <Clock className="mr-1 h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(taskResults.created_at), { addSuffix: true })}</span>
              </div>
            )}
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
            <ResultsContent 
              loading={false} 
              error={null} 
              taskId={taskId || null} 
              results={taskResults} 
              exportCSV={() => {
                if (taskResults?.result_url) {
                  window.open(taskResults.result_url, '_blank');
                }
              }}
              isLimited={taskResults?.limited || false}
              planInfo={taskResults?.current_plan}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
