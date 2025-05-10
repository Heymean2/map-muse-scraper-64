
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  LayoutList, 
  CalendarDays, 
  Plus, 
  RefreshCw,
  MapPin,
  Search
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
import { Input } from "@/components/ui/input";

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
                <BreadcrumbLink href="/dashboard" className="text-google-blue hover:text-google-blue/80">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold mt-2 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-google-red" />
            Scraping Results
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-1 border-google-blue/30 text-google-blue hover:bg-google-blue/5 hover:border-google-blue transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button
            onClick={handleNewTask}
            className="gap-1 bg-google-blue hover:bg-google-blue/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search tasks by keyword..." 
          className="pl-10 border-slate-200 focus:border-google-blue focus:ring-google-blue/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
      <div className="flex justify-center">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full md:w-auto">
          <TabsList className="bg-slate-100">
            <TabsTrigger 
              value="list" 
              className="flex items-center gap-1 data-[state=active]:bg-google-blue data-[state=active]:text-white"
            >
              <LayoutList className="h-4 w-4" />
              <span>List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="board" 
              className="flex items-center gap-1 data-[state=active]:bg-google-green data-[state=active]:text-white"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Board</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-1 data-[state=active]:bg-google-yellow data-[state=active]:text-white"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Based on View Mode */}
      <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all">
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
