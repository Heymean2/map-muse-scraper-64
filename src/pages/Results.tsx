
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getScrapingResults } from "@/services/scraper/taskManagement";
import { useQuery } from "@tanstack/react-query";
import TaskDetail from "@/pages/TaskDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResultsDashboard from "@/components/results/ResultsDashboard";

export default function Results() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch all tasks for the user
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allScrapingTasks'],
    queryFn: () => getScrapingResults(),
  });

  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    navigate(`/dashboard/results/scrape/${taskId}`);
  };
  
  // Extract tasks array safely
  const tasks = data && 'tasks' in data ? data.tasks : [];

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <DashboardLayout hideRail={true}>
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
