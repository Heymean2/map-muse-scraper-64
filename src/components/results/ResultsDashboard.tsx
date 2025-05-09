
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  LayoutList, 
  CalendarDays, 
  Plus, 
  RefreshCw, 
  BarChart4,
  Filter
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

import TasksMetrics from "./dashboard/TasksMetrics";
import TasksListView from "./views/TasksListView";
import TasksBoardView from "./views/TasksBoardView";
import TasksCalendarView from "./views/TasksCalendarView";

interface ResultsDashboardProps {
  tasks: any[];
  isLoading: boolean;
  error: any;
  onTaskSelect: (taskId: string) => void;
  onRefresh: () => void;
  viewMode: 'list' | 'board' | 'calendar';
  setViewMode: (mode: 'list' | 'board' | 'calendar') => void;
}

export default function ResultsDashboard({ 
  tasks, 
  isLoading, 
  error, 
  onTaskSelect,
  onRefresh,
  viewMode,
  setViewMode
}: ResultsDashboardProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewTask = () => {
    navigate("/dashboard/scrape");
  };
  
  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "Refreshing data",
      description: "Getting the latest results for you."
    });
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.keywords?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count tasks by status
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const processingTasks = tasks.filter(task => task.status === 'processing').length;
  const failedTasks = tasks.filter(task => task.status === 'failed').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Breadcrumbs */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
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
          <h1 className="text-2xl font-bold mt-2">Scraping Results</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button
            onClick={handleNewTask}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <TasksMetrics 
        totalTasks={tasks.length}
        completedTasks={completedTasks}
        processingTasks={processingTasks}
        failedTasks={failedTasks}
        isLoading={isLoading}
      />
      
      {/* View Selection Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <LayoutList className="h-4 w-4" />
              <span>List</span>
            </TabsTrigger>
            <TabsTrigger value="board" className="flex items-center gap-1">
              <LayoutGrid className="h-4 w-4" />
              <span>Board</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <BarChart4 className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>

      {/* Content Based on View Mode */}
      <Card className="overflow-hidden border-slate-200">
        <CardContent className="p-0">
          {viewMode === 'list' && (
            <TasksListView 
              tasks={filteredTasks} 
              isLoading={isLoading} 
              error={error}
              onTaskSelect={onTaskSelect}
            />
          )}
          
          {viewMode === 'board' && (
            <TasksBoardView 
              tasks={filteredTasks} 
              isLoading={isLoading} 
              error={error}
              onTaskSelect={onTaskSelect}
            />
          )}
          
          {viewMode === 'calendar' && (
            <TasksCalendarView 
              tasks={filteredTasks} 
              isLoading={isLoading} 
              onTaskSelect={onTaskSelect}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
