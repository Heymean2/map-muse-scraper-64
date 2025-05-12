import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { getScrapingResults } from "@/services/scraper";
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
      console.log("Results: Task from URL param detected:", taskIdParam);
      // We no longer send to backend here - this is already handled in FormSubmissionHandler
      // Instead, just navigate to the task detail page
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
    
    // No longer send to backend here - we only send once from FormSubmissionHandler
    console.log("Results: Selected task:", taskId);
    
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
