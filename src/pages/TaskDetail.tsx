
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper";
import { toast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import TaskDetailLayout from "@/components/results/layout/TaskDetailLayout";
import TaskHeader from "@/components/results/task-detail/TaskHeader";
import TaskContent from "@/components/results/task-detail/TaskContent";
import { ScrapingResultSingle, ScrapingResultMultiple } from "@/services/scraper/types";

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pollingInterval, setPollingInterval] = useState<number>(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // We no longer send to backend here - task should have already been sent from FormSubmissionHandler
    console.log("TaskDetail: Displaying task:", taskId);
    
    return () => {
      // Clean up any intervals when component unmounts
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [taskId, user, pollingInterval]);

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

  // Set up polling for in-progress tasks
  useEffect(() => {
    // Clear any existing interval
    if (pollingInterval) clearInterval(pollingInterval);
    
    // If task is still processing, set up polling
    if (taskResults && 
        ('status' in taskResults) && 
        taskResults.status === 'processing') {
      
      // Poll every 10 seconds for updates
      const interval = window.setInterval(() => {
        console.log("Polling for task updates...");
        refetchTaskResults();
      }, 10000);
      
      setPollingInterval(interval);
    }
    
    // Clean up on unmount or when status changes
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [taskResults, refetchTaskResults]);

  const handleRefresh = () => {
    refetchTaskResults();
    toast({
      title: "Refreshing data",
      description: "Getting the latest results for you."
    });
    
    // We no longer send to backend here - just refresh the data from Supabase
    console.log("TaskDetail: Refreshing data for task:", taskId);
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
    
    // Type guard to determine if we have a single result or multiple results
    const isSingleResult = (result: any): result is ScrapingResultSingle => 
      !('tasks' in result);
    
    if (!isSingleResult(taskResults)) {
      // This is a multiple result, which shouldn't happen when we have a taskId
      // But handle it gracefully anyway
      return null;
    }
    
    // Now we know we're working with a single result
    const singleResult = taskResults;
    
    // Extract task-specific properties safely
    const keywords = singleResult.keywords || 
                    (singleResult.search_info?.keywords) || 
                    'Task Details';
                    
    const createdAt = singleResult.created_at || null;
    const resultUrl = singleResult.result_url || null;
    const isLimited = 'limited' in singleResult ? singleResult.limited : false;
    const currentPlan = 'current_plan' in singleResult ? singleResult.current_plan : null;
    const status = singleResult.status || 'processing';
    const stage = singleResult.stage || status;
    
    // Get search info and fields
    let searchInfo = null;
    let fields: string[] = [];
    
    if (singleResult.search_info) {
      searchInfo = singleResult.search_info;
      fields = searchInfo.fields ? ensureArray(searchInfo.fields) : [];
    } else {
      // Fallback if search_info doesn't exist
      searchInfo = {
        keywords,
        location: `${singleResult.country || ''} - ${singleResult.states || ''}`,
        fields: singleResult.fields ? ensureArray(singleResult.fields) : []
      };
      fields = ensureArray(singleResult.fields);
    }
    
    return {
      keywords,
      createdAt,
      searchInfo,
      resultUrl,
      isLimited,
      currentPlan,
      status,
      stage,
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
            status={taskData.status}
            stage={taskData.stage}
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
          ) : taskData ? (
            <TaskContent 
              taskId={taskId || null}
              results={taskResults}
              isLoading={isLoading}
              error={error}
              isLimited={taskData.isLimited || false}
              planInfo={taskData.currentPlan}
            />
          ) : (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center">
              <Card className="p-5">
                <h3 className="text-lg font-medium mb-2">No Task Data Available</h3>
                <p className="mb-4">We couldn't find any information for this task.</p>
                <Button onClick={() => navigate('/dashboard/results')}>
                  Return to Results
                </Button>
              </Card>
            </div>
          )}
        </AnimatePresence>
      </div>
    </TaskDetailLayout>
  );
}
