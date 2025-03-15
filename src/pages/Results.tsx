
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getScrapingResults, getUserScrapingTasks } from "@/services/scraper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withDelay, animationClasses } from "@/lib/animations";
import { Download, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import TaskList from "@/components/results/TaskList";
import ResultsContent from "@/components/results/ResultsContent";

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
              
              <Button 
                variant="outline" 
                onClick={fetchResults}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <TaskList 
              userTasks={userTasks}
              tasksLoading={tasksLoading}
              currentTaskId={taskId}
              onTaskClick={handleTaskClick}
            />
            
            <ResultsContent 
              loading={loading}
              error={error}
              taskId={taskId}
              results={results}
              exportCSV={handleExportCSV}
            />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
