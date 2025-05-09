
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import ResultsContent from "@/components/results/ResultsContent";
import TaskInfoCard from "./TaskInfoCard";

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
  const getExportCsvHandler = () => {
    if (results && results.result_url) {
      return () => window.open(results.result_url, '_blank');
    }
    return () => {};
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TaskInfoCard 
            searchInfo={results?.search_info}
            totalCount={results?.total_count || 0}
            completedAt={results?.updated_at}
            taskStatus={results?.status}
          />
        </motion.div>
        
        <motion.div 
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-sm border-0 bg-white">
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
        </motion.div>
      </div>
    </div>
  );
}
