
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ResultsTable from "./ResultsTable";
import SearchInfoCard from "./SearchInfoCard";
import { Lock } from "lucide-react";

interface ResultsContentProps {
  loading: boolean;
  error: string | null;
  taskId: string | null;
  results: any;
  exportCSV: () => void;
  isLimited?: boolean;
}

export default function ResultsContent({ 
  loading, 
  error, 
  taskId, 
  results, 
  exportCSV,
  isLimited = false
}: ResultsContentProps) {
  if (loading) {
    return (
      <div className="md:col-span-3 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-3 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!taskId) {
    return (
      <div className="md:col-span-3 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-blue-700 dark:text-blue-400">
          Select a task from the sidebar to view results or create a new scraping task.
        </p>
      </div>
    );
  }

  if (results?.status === "processing") {
    return (
      <div className="md:col-span-3 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-blue-700 dark:text-blue-400">
          Your scraping task is still processing. The page will refresh automatically when results are ready.
        </p>
      </div>
    );
  }

  if (!results?.data?.length) {
    return (
      <div className="md:col-span-3 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-yellow-700 dark:text-yellow-400">
          No results found. This could be because the task is still processing or no data matched your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="md:col-span-3">
      <div className="flex justify-between items-center mb-4">
        <div>
          {isLimited && (
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
              <Lock className="h-3 w-3" />
              <span>Showing limited preview (5 rows)</span>
            </div>
          )}
        </div>
        <Button 
          onClick={exportCSV}
          disabled={!results?.data?.length}
        >
          Export CSV
        </Button>
      </div>
      
      <ResultsTable 
        data={results.data} 
        searchInfo={results.search_info}
        totalCount={results.total_count || 0}
      />
      
      <SearchInfoCard 
        totalCount={results.total_count || 0} 
        searchInfo={results.search_info}
      />
    </div>
  );
}
