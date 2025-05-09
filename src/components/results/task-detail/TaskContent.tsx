
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResultsContent from "@/components/results/ResultsContent";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import SearchInfoCard from "@/components/results/SearchInfoCard";

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

  // Get search info from various possible locations in the results object
  const getSearchInfo = () => {
    if (results?.search_info) {
      return results.search_info;
    }
    
    // Try to extract from the results object directly if needed
    return {
      keywords: results?.keywords || '',
      location: results?.location || '',
      fields: results?.fields || [],
      data: results?.data || []
    };
  };
  
  const searchInfo = getSearchInfo();

  // Display the completed success message if no data or task is completed
  if (results?.status === "completed" && (!searchInfo?.data || !searchInfo?.data.length)) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card className="overflow-hidden border bg-white shadow-sm">
          <CardContent className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Task Completed Successfully</h2>
              <p className="text-gray-600 max-w-lg mb-8">
                Your data is ready to be downloaded. No preview is available, but you can download the full CSV file.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  className="gap-2" 
                  onClick={getExportCsvHandler()}
                >
                  <Download className="h-4 w-4" />
                  Download Results
                </Button>
                
                <Button 
                  variant="outline"
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview CSV
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Search Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchInfo?.keywords && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Keywords</span>
                  <span className="text-sm font-medium">{searchInfo.keywords}</span>
                </div>
              )}
              
              {searchInfo?.location && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Location</span>
                  <span className="text-sm font-medium">{searchInfo.location}</span>
                </div>
              )}
              
              {searchInfo?.fields && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Fields</span>
                  <span className="text-sm font-medium">
                    {Array.isArray(searchInfo.fields) 
                      ? searchInfo.fields.join(", ")
                      : typeof searchInfo.fields === 'string'
                        ? searchInfo.fields
                        : ''}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total Count</span>
                <span className="text-sm font-medium">{results?.total_count || 0} results</span>
              </div>
              
              {results?.updated_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Completed At</span>
                  <span className="text-sm font-medium">
                    {new Date(results.updated_at).toLocaleString()}
                  </span>
                </div>
              )}
              
              {results?.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Created At</span>
                  <span className="text-sm font-medium">
                    {new Date(results.created_at).toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
            totalCount={results?.total_count || 0}
            completedAt={results?.updated_at}
          />
        </div>
      )}
    </div>
  );
}
