
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getScrapingResults, getUserId } from "@/services/scraper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withDelay, animationClasses } from "@/lib/animations";
import { Download, ArrowLeft, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export default function Results() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const { toast } = useToast();
  
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getScrapingResults(taskId || undefined);
      setResults(data);
    } catch (err) {
      setError("Failed to fetch results. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchResults();
    
    // If task is still processing, poll for results every 10 seconds
    const intervalId = setInterval(() => {
      if (results?.status === "processing") {
        fetchResults();
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [taskId]);
  
  const handleExportCSV = () => {
    if (!results?.data) return;
    
    // Convert results to CSV
    const headers = Object.keys(results.data[0] || {}).join(',');
    const csvRows = results.data.map((row: any) => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scraping-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="mb-8">
            <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
              Scraping Results
            </h1>
            
            <div className="flex items-center justify-between">
              <p className={`text-lg text-slate-600 dark:text-slate-400 ${withDelay(animationClasses.slideUp, 200)}`}>
                User ID: {getUserId()}
                {taskId && <span className="ml-2 text-sm">(Task: {taskId})</span>}
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={fetchResults}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button 
                  onClick={handleExportCSV}
                  disabled={!results?.data?.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : results?.status === "processing" ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-400">
                Your scraping task is still processing. The page will refresh automatically when results are ready.
              </p>
            </div>
          ) : !results?.data?.length ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-700 dark:text-yellow-400">
                No results found. This could be because the task is still processing or no data matched your criteria.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <Table>
                <TableCaption>Data extracted from Google Maps based on your search criteria.</TableCaption>
                <TableHeader>
                  <TableRow>
                    {Object.keys(results.data[0] || {}).map((header) => (
                      <TableHead key={header}>
                        {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.data.map((item: any, index: number) => (
                    <TableRow key={index}>
                      {Object.values(item).map((value: any, valueIndex: number) => (
                        <TableCell key={valueIndex}>
                          {typeof value === 'string' && value.startsWith('http') ? (
                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Image
                            </a>
                          ) : (
                            String(value)
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {results?.total_count > 0 && (
            <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="font-medium">Total Records: {results.total_count}</p>
              {results.search_info && (
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>Search: {results.search_info.keywords}</p>
                  <p>Location: {results.search_info.location}</p>
                  {results.search_info.filters && (
                    <p>Filters: {JSON.stringify(results.search_info.filters)}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
