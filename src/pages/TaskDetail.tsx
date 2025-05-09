
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper/taskManagement";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Clock, RefreshCw, X, ChevronRight, 
  Calendar, Tag, MapPin, Check, Download, Share2, AlertCircle 
} from "lucide-react";
import ResultsContent from "@/components/results/ResultsContent";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { formatDistanceToNow, format } from "date-fns";
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
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
        id: String(task.task_id),
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
  const taskStatus = taskResults && 'status' in taskResults ? taskResults.status : 'processing';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto p-4 md:p-6"
      >
        {/* Breadcrumbs with animation */}
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

        {/* Task header with animations */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold">{searchInfo?.keywords || taskKeywords}</h1>
                <Badge className={`${getStatusColor(taskStatus as string)} flex items-center gap-1`}>
                  {getStatusIcon(taskStatus as string)}
                  <span className="capitalize">{taskStatus}</span>
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                {taskCreatedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Created {formatDistanceToNow(new Date(taskCreatedAt), { addSuffix: true })}</span>
                    <span className="text-gray-400">({format(new Date(taskCreatedAt), "MMM d, yyyy")})</span>
                  </div>
                )}
                
                {searchInfo?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{searchInfo.location}</span>
                  </div>
                )}
                
                {searchInfo?.fields && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span>{searchInfo.fields.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/result')}
                className="hover:bg-gray-100 gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowTasksList(true)}
                className="md:hidden gap-2"
              >
                <span>View All Tasks</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {resultUrl && (
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(resultUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </Button>
              )}
              
              <Button 
                onClick={handleRefresh}
                className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Task content with content-based loading states */}
        <AnimatePresence mode="wait">
          {taskLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center py-12"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="mt-4 text-center text-indigo-600 font-medium">Loading Results</div>
              </div>
            </motion.div>
          ) : taskError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-5 border rounded bg-red-50 text-red-700 flex items-center justify-center flex-col">
                <AlertCircle className="h-10 w-10 mb-4 text-red-500" />
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Error Loading Results</h3>
                  <p className="mb-4">We encountered a problem while fetching your task results.</p>
                  <Button 
                    variant="destructive" 
                    onClick={handleRefresh} 
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="animate-fade-in"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related tasks sidebar */}
        <Sheet open={showTasksList} onOpenChange={setShowTasksList}>
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <SheetHeader className="p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <SheetTitle className="text-white">All Tasks</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
              <AnimatePresence>
                {otherTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                      task.task_id === taskId ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                    }`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="font-medium">{task.keywords}</div>
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                      </span>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </Badge>
                    </div>
                    {task.country && (
                      <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {task.country}
                        {task.states && ` (${task.states})`}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </DashboardLayout>
  );
}
