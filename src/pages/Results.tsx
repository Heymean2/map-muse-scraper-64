
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { getScrapingResults, sendTaskToBackend } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import TaskDetail from "@/pages/TaskDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResultsDashboard from "@/components/results/ResultsDashboard";

export default function Results() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if there's a task_id in search params
    const taskIdParam = searchParams.get('task_id');
    if (taskIdParam && user?.id) {
      // Send the task to the external backend
      console.log("Results: Sending task from URL param to external backend:", taskIdParam);
      sendTaskToBackend(user.id, taskIdParam)
        .catch(error => console.error("Failed to send task from URL param:", error));
      
      // Navigate to the task detail page
      navigate(`/dashboard/results/scrape/${taskIdParam}`);
    }
  }, [searchParams, user]);

  // Fetch all tasks for the user
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allScrapingTasks'],
    queryFn: () => getScrapingResults(),
  });

  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    
    // Send the task to the external backend when selected
    if (user?.id) {
      console.log("Results: Sending selected task to external backend:", taskId);
      sendTaskToBackend(user.id, taskId)
        .catch(error => console.error("Failed to send selected task:", error));
    }
    
    navigate(`/dashboard/results/scrape/${taskId}`);
  };
  
  // Extract tasks array safely
  const tasks = data && 'tasks' in data ? data.tasks : [];

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <DashboardLayout hideRail={true} hideSidebar={true}>
            <ResultsDashboard 
              tasks={tasks} 
              isLoading={isLoading} 
              error={error} 
              onTaskSelect={handleTaskSelect}
              onRefresh={refetch}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </DashboardLayout>
        } 
      />
      <Route path="/scrape/:taskId" element={<TaskDetail />} />
      <Route path="*" element={<Navigate to="/dashboard/results" replace />} />
    </Routes>
  );
}
