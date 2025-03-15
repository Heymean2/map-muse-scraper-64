
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Clock, FileText } from "lucide-react";

interface Task {
  id: string;
  task_id: string;
  keywords: string;
  created_at: string;
  status: "processing" | "completed" | "failed";
}

interface TaskListProps {
  userTasks: Task[];
  tasksLoading: boolean;
  currentTaskId: string | null;
  onTaskClick: (task: Task) => void;
}

export default function TaskList({ 
  userTasks, 
  tasksLoading, 
  currentTaskId, 
  onTaskClick 
}: TaskListProps) {
  const navigate = useNavigate();

  return (
    <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Your Scraping Tasks</h2>
      
      {tasksLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : userTasks.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          You haven't created any scraping tasks yet.
        </p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {userTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`p-3 rounded border ${task.task_id === currentTaskId ? 
                'bg-primary/10 border-primary' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'} 
                hover:border-primary cursor-pointer transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="truncate mr-2">
                  <p className="font-medium truncate">{task.keywords}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                    <Clock size={12} className="mr-1" />
                    {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                  task.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                }`}>
                  {task.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        className="w-full mt-4"
        onClick={() => navigate("/dashboard")}
      >
        <FileText className="h-4 w-4 mr-2" />
        New Scraping Task
      </Button>
    </div>
  );
}
