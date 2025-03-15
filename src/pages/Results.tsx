
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getScrapingResults, getUserScrapingTasks } from "@/services/scraper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withDelay, animationClasses } from "@/lib/animations";
import { Download, ArrowLeft, RefreshCw, Clock, FileText } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function Results() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [results, setResults] = useState<any>(null);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchResults = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
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
  
  const fetchUserTasks = async () => {
    if (!user) return;
    
    setTasksLoading(true);
    try {
      const tasks = await getUserScrapingTasks();
      setUserTasks(tasks);
    } catch (err) {
      console.error("Error fetching user tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchResults();
    fetchUserTasks();
    
    // If task is still processing, poll for results every 10 seconds
    const intervalId = setInterval(() => {
      if (results?.status === "processing") {
        fetchResults();
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [taskId, user]);
  
  const handleTaskClick = (task: any) => {
    navigate(`/result?task_id=${task.task_id}`);
  };
  
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
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
              Scraping Results
            </h1>
            
            <div className="flex items-center justify-between">
              <p className={`text-lg text-slate-600 dark:text-slate-400 ${withDelay(animationClasses.slideUp, 200)}`}>
                {taskId && <span className="text-sm">(Task ID: {taskId})</span>}
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Your Scraping Tasks</h2>
              
              {tasksLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : userTasks.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  You haven't created any scraping tasks yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {userTasks.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`p-3 rounded border ${task.task_id === taskId ? 
                        'bg-primary/10 border-primary' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'} 
                        hover:border-primary cursor-pointer transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="truncate mr-2">
                          <p className="font-medium truncate">{task.keywords}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                            <Clock size={12} className="mr-1" />
                            {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                          task.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}>
                          {task.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-4"
                onClick={() => navigate("/dashboard")}
              >
                <FileText className="h-4 w-4 mr-2" />
                New Scraping Task
              </Button>
            </div>
            
            <div className="md:col-span-3">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              ) : !taskId ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-400">
                    Select a task from the sidebar to view results or create a new scraping task.
                  </p>
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
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b">
                    <h3 className="font-medium">Results for: {results.search_info?.keywords}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Found {results.total_count} records
                    </p>
                  </div>
                  <div className="overflow-x-auto">
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
                </div>
              )}
            </div>
          </div>
          
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
