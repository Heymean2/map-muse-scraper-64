
import { useNavigate } from "react-router-dom";
import TasksList from "./TasksList";
import EmptyTasksList from "./EmptyTasksList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { ScrapingRequest } from "@/services/scraper/types";
import { toast } from "@/components/ui/use-toast";

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

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <CardTitle>Your Scraping Tasks</CardTitle>
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={handleNewTask}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {tasks && tasks.length > 0 ? (
          <TasksList 
            isLoading={isLoading}
            error={error}
            tasks={tasks}
            onTaskSelect={onTaskSelect}
          />
        ) : (
          <EmptyTasksList />
        )}
      </CardContent>
    </Card>
  );
}
