
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import ResultsContent from "@/components/results/ResultsContent";
import { Button } from "@/components/ui/button";
import SearchInfoCard from "@/components/results/SearchInfoCard";
import TaskEmptyState from "./TaskEmptyState";
import TaskInfoCards from "./TaskInfoCards";
import TaskNoDataState from "./TaskNoDataState";
import TaskProgressCard from "./TaskProgressCard";
import { getSearchInfo } from "./utils/searchInfoUtils";
import { getTaskProgress } from "@/services/scraper/taskRetrieval";
import { useNavigate } from "react-router-dom";
import TaskDetailLoading from "./TaskDetailLoading";
import TaskDetailError from "./TaskDetailError";
import TaskDetailNoData from "./TaskDetailNoData";

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
  
  // Get task status
  const taskStatus = results?.status || 'processing';

  // Loading state
  if (isLoading) {
    return <TaskDetailLoading />;
  }
  
  // Error state
  if (error) {
    return <TaskDetailError onRetry={() => navigate('/dashboard/results')} />;
  }
  
  // Display empty state for completed task with no data
  if (results?.status === "completed" && (!searchInfo?.data || !searchInfo?.data.length)) {
    return (
      <div className="space-y-6">
        {taskStatus === "processing" && taskProgress && (
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
      </div>
    );
  }

  // If no task data available
  if (!taskId || !results) {
    return <TaskDetailNoData />;
  }

  // Main content with data
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Only show progress card when status is processing */}
      {taskStatus === "processing" && taskProgress && (
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
        <div>
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
