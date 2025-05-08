
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ResultsTable from "./ResultsTable";
import SearchInfoCard from "./SearchInfoCard";
import CSVPreview from "./CSVPreview";
import { FileDown, Lock, Download, AlertTriangle, Clock, Eye, Trophy, BarChart, MapPin, Table } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsContentProps {
  loading: boolean;
  error: string | null;
  taskId: string | null;
  results: any;
  exportCSV: () => void;
  isLimited?: boolean;
  planInfo?: any;
}

export default function ResultsContent({ 
  loading, 
  error, 
  taskId, 
  results, 
  exportCSV,
  isLimited = false,
  planInfo
}: ResultsContentProps) {
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [activeView, setActiveView] = useState("table");
  const navigate = useNavigate();
  
  // Limit data to 5 rows if user has exceeded free tier
  const getLimitedData = () => {
    if (!results?.data) return [];
    
    if (isLimited && Array.isArray(results.data) && results.data.length > 5) {
      return results.data.slice(0, 5);
    }
    
    return results.data;
  };
  
  const handleUpgradeClick = () => {
    navigate("/dashboard/billing");
    toast("Let's upgrade your plan!", {
      description: "Access all your data and continue scraping with our Pro plan.",
      action: {
        label: "Dismiss",
        onClick: () => {},
      },
    });
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (results?.status === "processing") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 flex flex-col items-center text-center gap-4">
            <Clock className="h-12 w-12 text-blue-500 animate-pulse" />
            <h3 className="text-xl font-medium text-blue-700 dark:text-blue-400">
              Processing Your Data
            </h3>
            <p className="text-blue-700 dark:text-blue-400">
              Your scraping task is still running. The page will refresh automatically when results are ready.
            </p>
            <div className="w-full max-w-md bg-blue-100 dark:bg-blue-800/30 rounded-full h-2.5 my-2">
              <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-500">
              Started: {results?.created_at ? format(new Date(results.created_at), 'MMM d, yyyy HH:mm') : 'Recently'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results?.status === "completed" && (!results?.data || !results?.data?.length)) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 flex flex-col items-center text-center gap-4">
            <Badge className="bg-green-500">Completed</Badge>
            <h3 className="text-xl font-medium text-green-700 dark:text-green-400">
              Task Completed Successfully
            </h3>
            <p className="text-green-700 dark:text-green-400">
              Your data is ready to be downloaded. No preview is available, but you can download the full CSV file.
            </p>
            
            <div className="flex gap-2 mt-2">
              {results.result_url && !isLimited && (
                <>
                  <Button 
                    className="gap-2" 
                    onClick={() => window.open(results.result_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                    Download Results
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="gap-2" 
                    onClick={() => setShowCsvPreview(true)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview CSV
                  </Button>
                </>
              )}
              
              {isLimited && (
                <Button 
                  className="gap-2" 
                  onClick={handleUpgradeClick}
                >
                  <Trophy className="h-4 w-4" />
                  Upgrade Now
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <SearchInfoCard 
              totalCount={results.total_count || 0} 
              searchInfo={{
                keywords: results.search_info?.keywords,
                location: results.search_info?.location,
                fields: results.search_info?.fields,
                rating: results.search_info?.rating
              }}
              completedAt={results.updated_at}
            />
          </div>
          
          {showCsvPreview && results.result_url && (
            <div className="mt-6">
              <CSVPreview 
                url={results.result_url} 
                onClose={() => setShowCsvPreview(false)}
                isLimited={isLimited}
                totalCount={results.total_count || 0}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!results?.data?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center gap-4">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
            <div>
              <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-400 mb-1">No Results Found</h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                This could be because the task is still processing or no data matched your criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Task Results</CardTitle>
            <CardDescription>
              Showing data for "{results.search_info?.keywords}" ({results.total_count} results)
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {results.result_url && !isLimited && (
              <Button 
                variant="outline" 
                onClick={() => window.open(results.result_url, '_blank')}
                className="gap-1 text-sm"
              >
                <FileDown className="h-4 w-4" />
                <span>Raw CSV</span>
              </Button>
            )}
            
            {results.result_url && !isLimited && (
              <Button 
                onClick={exportCSV}
                disabled={!results?.data?.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
            
            {isLimited && (
              <Button 
                onClick={handleUpgradeClick}
                className="gap-1"
              >
                <Trophy className="h-4 w-4" />
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
        
        {isLimited && (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm font-medium mt-2">
            <Lock className="h-3 w-3" />
            <span>Showing limited preview (5 rows)</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-1">
              <Table className="h-4 w-4" />
              <span>Table View</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            {results.search_info?.location && (
              <TabsTrigger value="map" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="table" className="mt-4">
            <ResultsTable 
              data={getLimitedData()} 
              searchInfo={results.search_info}
              totalCount={results.total_count || 0}
              isLimited={isLimited}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <div className="bg-slate-50 p-8 border rounded-lg text-center">
              <BarChart className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium mb-2">Analytics View</h3>
              <p className="text-slate-500 mb-4">
                Visualize your data with charts and insights.
              </p>
              {isLimited ? (
                <Button onClick={handleUpgradeClick}>Upgrade to Access Analytics</Button>
              ) : (
                <p className="text-sm text-slate-400">
                  This feature is coming soon!
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="mt-4">
            <div className="bg-slate-50 p-8 border rounded-lg text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium mb-2">Map View</h3>
              <p className="text-slate-500 mb-4">
                See your data plotted on an interactive map.
              </p>
              {isLimited ? (
                <Button onClick={handleUpgradeClick}>Upgrade to Access Map View</Button>
              ) : (
                <p className="text-sm text-slate-400">
                  This feature is coming soon!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <SearchInfoCard 
            totalCount={results.total_count || 0} 
            searchInfo={{
              keywords: results.search_info?.keywords,
              location: results.search_info?.location,
              fields: results.search_info?.fields,
              rating: results.search_info?.rating
            }}
            completedAt={results.updated_at}
          />
        </div>
        
        {showCsvPreview && results.result_url && (
          <div className="mt-6">
            <CSVPreview 
              url={results.result_url} 
              onClose={() => setShowCsvPreview(false)}
              isLimited={isLimited}
              totalCount={results.total_count || 0}
              maxPreviewRows={isLimited ? 5 : undefined}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
