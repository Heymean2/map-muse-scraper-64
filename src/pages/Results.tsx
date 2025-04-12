
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getScrapingResults } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import TaskDetail from "@/pages/TaskDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Results() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch all tasks for the user
  const { data, isLoading, error } = useQuery({
    queryKey: ['allScrapingTasks'],
    queryFn: () => getScrapingResults(),
  });

  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    navigate(`/result/scrape/${taskId}`);
  };

  // This component renders the task list and sets up routes
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Scraping Results</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="p-4 border rounded bg-red-50 text-red-700">
                Error loading tasks. Please try again later.
              </div>
            ) : data?.tasks && data.tasks.length > 0 ? (
              <div className="grid gap-4">
                {data.tasks.map((task: any) => (
                  <div 
                    key={task.task_id}
                    className="border rounded p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleTaskSelect(task.task_id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{task.keywords}</h3>
                        <p className="text-sm text-slate-500">
                          {task.country} - {task.states} • Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          task.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded">
                <p className="text-lg">No scraping tasks found</p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  onClick={() => navigate('/dashboard/scrape')}
                >
                  Create your first scraping task
                </button>
              </div>
            )}
          </div>
        } />
        <Route path="/scrape/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<Navigate to="/result" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
