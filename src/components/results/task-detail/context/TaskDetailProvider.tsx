
import { ReactNode, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScrapingResults } from "@/services/scraper";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ScrapingResultSingle } from "@/services/scraper/types";
import { createContext, useContext } from "react";

interface TaskDetailContextType {
  taskId: string | undefined;
  taskResults: ScrapingResultSingle | null;
  isLoading: boolean;
  error: any;
  refetchTaskResults: () => void;
  handleRefresh: () => void;
  taskData: {
    keywords: string;
    createdAt: string | null;
    searchInfo: any;
    resultUrl: string | null;
    isLimited: boolean;
    currentPlan: any;
    status: string;
    stage: string;
    fields: string[];
  } | null;
}

const TaskDetailContext = createContext<TaskDetailContextType | undefined>(undefined);

export const useTaskDetail = () => {
  const context = useContext(TaskDetailContext);
  if (!context) {
    throw new Error("useTaskDetail must be used within a TaskDetailProvider");
  }
  return context;
};

interface TaskDetailProviderProps {
  children: ReactNode;
}

export const TaskDetailProvider = ({ children }: TaskDetailProviderProps) => {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const [pollingInterval, setPollingInterval] = useState<number>(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    console.log("TaskDetail: Displaying task:", taskId);
    
    return () => {
      // Clean up any intervals when component unmounts
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [taskId, user, pollingInterval]);

  // Get the current task's results
  const { 
    data: rawTaskResults,
    isLoading,
    error,
    refetch: refetchTaskResults
  } = useQuery({
    queryKey: ['scrapingResults', taskId],
    queryFn: () => getScrapingResults(taskId),
    enabled: !!taskId,
  });

  // Type guard to determine if we have a single result
  const isSingleResult = (result: any): result is ScrapingResultSingle => 
    result && !('tasks' in result);
    
  // Extract the single task result or null
  const taskResults = rawTaskResults && isSingleResult(rawTaskResults) 
    ? rawTaskResults 
    : null;

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

  const value = {
    taskId,
    taskResults,
    isLoading,
    error,
    refetchTaskResults,
    handleRefresh,
    taskData
  };

  return (
    <TaskDetailContext.Provider value={value}>
      {children}
    </TaskDetailContext.Provider>
  );
};
