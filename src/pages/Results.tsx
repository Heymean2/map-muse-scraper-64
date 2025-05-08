
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getScrapingResults } from "@/services/scraper";
import { useQuery } from "@tanstack/react-query";
import TaskDetail from "@/pages/TaskDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import TaskList from "@/components/results/TaskList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, List, Plus } from "lucide-react";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  // Format tasks data for component
  const formatTasksData = () => {
    if (!data?.tasks) return [];
    
    return data.tasks.map((task: any) => ({
      id: task.id || task.task_id,
      task_id: task.task_id,
      keywords: task.keywords || 'Untitled Task',
      created_at: task.created_at,
      status: task.status,
      country: task.country,
      states: task.states,
      total_results: task.total_results
    }));
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={
          <div className="p-6">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Results</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex items-center justify-between mt-4">
                <h1 className="text-2xl font-bold">Scraping Results</h1>
                <Button onClick={() => navigate('/dashboard/scrape')}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </div>
            </div>
          
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Tasks</CardTitle>
                      <CardDescription>
                        {data?.tasks?.length 
                          ? `${data.tasks.length} total tasks` 
                          : 'No tasks found'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <List className="mr-2 h-4 w-4" />
                        Group
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="mb-6">
                    <TabsList>
                      <TabsTrigger value="all">All Tasks</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="processing">Processing</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
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
                          className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => handleTaskSelect(task.task_id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{task.keywords}</h3>
                              <p className="text-sm text-slate-500 mt-1">
                                {task.country} - {task.states} • Created: {new Date(task.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-3 py-1 text-xs rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                task.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                          {task.total_results && (
                            <div className="mt-2 text-sm">
                              <span className="text-slate-600 font-medium">{task.total_results}</span> results found
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <h3 className="text-xl font-medium mb-2">No scraping tasks found</h3>
                      <p className="text-slate-500 mb-6">Create your first task to get started</p>
                      <Button 
                        onClick={() => navigate('/dashboard/scrape')}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Scraping Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        } />
        <Route path="/scrape/:taskId" element={<TaskDetail />} />
        <Route path="*" element={<Navigate to="/result" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
