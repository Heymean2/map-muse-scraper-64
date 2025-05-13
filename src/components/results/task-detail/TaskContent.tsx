
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import ResultsContent from "@/components/results/ResultsContent";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInfoCard from "@/components/results/SearchInfoCard";
import TaskEmptyState from "./TaskEmptyState";
import TaskInfoCards from "./TaskInfoCards";
import TaskNoDataState from "./TaskNoDataState";
import TaskProgressCard from "./TaskProgressCard";
import { getSearchInfo } from "./utils/searchInfoUtils";
import { getTaskProgress } from "@/services/scraper/taskRetrieval";
import { useNavigate } from "react-router-dom";

interface TaskContentProps {
  taskId: string | null;
  results: any;
  isLoading: boolean;
  error: any;
  isLimited: boolean;
  planInfo: any;
}

export default function TaskContent({ 
  taskId, 
  results, 
  isLoading, 
  error,
  isLimited,
  planInfo
}: TaskContentProps) {
  const navigate = useNavigate();
  
  const getExportCsvHandler = () => {
    if (results && results.result_url) {
      return () => window.open(results.result_url, '_blank');
    }
    return () => {};
  };

  // Handler for JSON export
  const getExportJsonHandler = () => {
    if (results && results.json_result_url) {
      return () => window.open(results.json_result_url, '_blank');
    }
    return () => {};
  };
  
  // Get search info
  const searchInfo = getSearchInfo(results);
  
  // Get task progress information
  const taskProgress = results ? getTaskProgress(results) : null;

  // Loading state
  if (isLoading) {
    return (
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
    );
  }
  
  // Error state
  if (error) {
    return (
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
              onClick={() => navigate('/dashboard/results')} 
              className="gap-2"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  // Display empty state for completed task with no data
  if (results?.status === "completed" && (!searchInfo?.data || !searchInfo?.data.length)) {
    return (
      <>
        {taskProgress && (
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <TaskProgressCard 
              progress={taskProgress} 
              status={results.status} 
              createdAt={results.created_at} 
            />
          </div>
        )}
        <TaskEmptyState 
          results={results} 
          getExportCsvHandler={getExportCsvHandler} 
          getExportJsonHandler={getExportJsonHandler} 
          searchInfo={searchInfo}
        />
        <TaskInfoCards searchInfo={searchInfo} results={results} />
      </>
    );
  }

  // If no task data available
  if (!taskId || !results) {
    return <TaskNoDataState />;
  }

  // Main content with data
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {taskProgress && (
        <TaskProgressCard 
          progress={taskProgress} 
          status={results.status} 
          createdAt={results.created_at} 
        />
      )}
      
      <Card className="overflow-hidden shadow-sm border bg-white">
        <CardContent className="p-0">
          <ResultsContent 
            loading={isLoading}
            error={error} 
            taskId={taskId} 
            results={results}
            exportCSV={getExportCsvHandler()}
            isLimited={isLimited}
            planInfo={planInfo}
          />
        </CardContent>
      </Card>
      
      {searchInfo && (
        <div className="mt-6">
          <SearchInfoCard 
            searchInfo={{
              keywords: searchInfo.keywords,
              location: searchInfo.location,
              fields: Array.isArray(searchInfo.fields) ? searchInfo.fields : 
                typeof searchInfo.fields === 'string' ? searchInfo.fields.split(',') : [],
              rating: searchInfo.rating
            }}
            totalCount={results?.total_count || results?.row_count || 0}
            completedAt={results?.updated_at}
          />
        </div>
      )}
      
      <TaskInfoCards searchInfo={searchInfo} results={results} />
    </div>
  );
}
