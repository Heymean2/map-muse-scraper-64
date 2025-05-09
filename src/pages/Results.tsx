
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getScrapingResults } from "@/services/scraper/taskManagement";
import { useQuery } from "@tanstack/react-query";
import TaskDetail from "@/pages/TaskDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResultsHeader from "@/components/results/ResultsHeader";
import TasksContainer from "@/components/results/TasksContainer";
import { ScrapingRequest } from "@/services/scraper/types";

export default function Results() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isTaskDetailPage = location.pathname.includes('/scrape/');
  
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
    navigate(`/result/scrape/${taskId}`);
  };
  
  // Extract tasks array safely
  const tasks = data && 'tasks' in data ? data.tasks : [];

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={
          <div className="p-6">
            <ResultsHeader tasksCount={tasks?.length} />
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <TasksContainer 
                isLoading={isLoading}
                error={error}
                tasks={tasks}
                onTaskSelect={handleTaskSelect}
                onRefresh={refetch}
              />
            </div>
          </div>
        } />
        <Route path="/scrape/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<Navigate to="/result" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
