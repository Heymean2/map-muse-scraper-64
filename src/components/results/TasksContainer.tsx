
import { useNavigate } from "react-router-dom";
import TasksList from "./TasksList";
import EmptyTasksList from "./EmptyTasksList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Search } from "lucide-react";
import { ScrapingRequest } from "@/services/scraper/types";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TasksContainerProps {
  isLoading: boolean;
  error: any;
  tasks: ScrapingRequest[];
  onTaskSelect: (taskId: string) => void;
  onRefresh?: () => void;
}

export default function TasksContainer({ 
  isLoading, 
  error, 
  tasks, 
  onTaskSelect,
  onRefresh
}: TasksContainerProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleNewTask = () => {
    navigate("/dashboard/scrape");
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      toast({
        title: "Refreshing data",
        description: "Getting the latest results for you."
      });
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.keywords?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="conversion-card shadow-card border-slate-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-violet-primary">Your Scraping Tasks</CardTitle>
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="gap-1 border-slate-200 hover:border-violet-primary/30 hover:bg-violet-primary/5"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={handleNewTask}
            className="gap-1 bg-violet-primary hover:bg-violet-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 border-slate-200 focus:border-violet-primary focus:ring-violet-primary/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filteredTasks && filteredTasks.length > 0 ? (
          <TasksList 
            isLoading={isLoading}
            error={error}
            tasks={filteredTasks}
            onTaskSelect={onTaskSelect}
          />
        ) : (
          <EmptyTasksList />
        )}
      </CardContent>
    </Card>
  );
}
