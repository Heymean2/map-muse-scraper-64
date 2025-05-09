
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper/taskManagement";
import { toast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TaskDetailLayout from "@/components/results/layout/TaskDetailLayout";
import TaskHeader from "@/components/results/task-detail/TaskHeader";
import TaskContent from "@/components/results/task-detail/TaskContent";

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [taskId]);

  // Get the current task's results
  const { 
    data: taskResults,
    isLoading,
    error,
    refetch: refetchTaskResults
  } = useQuery({
    queryKey: ['scrapingResults', taskId],
    queryFn: () => getScrapingResults(taskId),
    enabled: !!taskId,
  });

  const handleRefresh = () => {
    refetchTaskResults();
    toast({
      title: "Refreshing data",
      description: "Getting the latest results for you."
    });
  };

  // Helper function to ensure fields is an array before using join
  const ensureArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Handle comma-separated string
      return value.split(',').map(item => item.trim());
    }
    if (value === null || value === undefined) return [];
    return [String(value)]; // Convert single value to array
  };
  
  // Safely access task data regardless of structure
  const getTaskData = () => {
    if (!taskResults) return null;
    
    // Extract task-specific properties safely
    let keywords;
    let createdAt;
    let searchInfo;
    let resultUrl;
    let isLimited;
    let currentPlan;
    let status;
    let fields;
    
    // Handle possible different data structures
    if ('keywords' in taskResults) {
      keywords = taskResults.keywords;
    } else if (taskResults.search_info?.keywords) {
      keywords = taskResults.search_info.keywords;
    } else {
      keywords = 'Task Details';
    }
    
    createdAt = 'created_at' in taskResults ? taskResults.created_at : null;
    resultUrl = 'result_url' in taskResults ? taskResults.result_url : null;
    isLimited = 'limited' in taskResults ? taskResults.limited : false;
    currentPlan = 'current_plan' in taskResults ? taskResults.current_plan : null;
    status = 'status' in taskResults ? taskResults.status : 'processing';
    
    // Get search info
    if ('search_info' in taskResults) {
      searchInfo = taskResults.search_info;
      fields = searchInfo?.fields ? ensureArray(searchInfo.fields) : [];
    } else {
      // Fallback if search_info doesn't exist
      searchInfo = {
        keywords,
        location: taskResults.location,
        fields: taskResults.fields
      };
      fields = searchInfo?.fields ? ensureArray(searchInfo.fields) : [];
    }
    
    return {
      keywords,
      createdAt,
      searchInfo,
      resultUrl,
      isLimited,
      currentPlan,
      status,
      fields
    };
  };
  
  const taskData = getTaskData();

  return (
    <TaskDetailLayout>
      <div className="bg-white min-h-screen">
        {taskData && (
          <TaskHeader 
            title={taskData.keywords || "Task Details"}
            status={taskData.status as string}
            createdAt={taskData.createdAt}
            location={taskData.searchInfo?.location}
            fields={taskData.fields}
            resultUrl={taskData.resultUrl}
            onRefresh={handleRefresh}
          />
        )}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-4 py-12 flex justify-center"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="mt-4 text-center text-indigo-600 font-medium">Loading Results</div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-4 py-12"
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
                    Try Again
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <TaskContent 
              taskId={taskId}
              results={taskResults}
              isLoading={isLoading}
              error={error}
              isLimited={taskData?.isLimited || false}
              planInfo={taskData?.currentPlan}
            />
          )}
        </AnimatePresence>
      </div>
    </TaskDetailLayout>
  );
}
