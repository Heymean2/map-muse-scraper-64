
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, Check, AlertCircle, MapPin, Search } from "lucide-react";
import EmptyTasksList from "@/components/results/EmptyTasksList";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  task_id: string;
  keywords: string;
  created_at: string;
  status: "processing" | "completed" | "failed";
  country?: string;
  states?: string;
}

interface TasksBoardViewProps {
  tasks: Task[];
  isLoading: boolean;
  error: any;
  onTaskSelect: (taskId: string) => void;
}

export default function TasksBoardView({
  tasks,
  isLoading,
  error,
  onTaskSelect
}: TasksBoardViewProps) {
  // Group tasks by status
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const processingTasks = tasks.filter(task => task.status === 'processing');
  const failedTasks = tasks.filter(task => task.status === 'failed');

  const columns = [
    { title: "Processing", icon: Clock, tasks: processingTasks, color: "bg-amber-500", lightColor: "bg-amber-50" },
    { title: "Completed", icon: Check, tasks: completedTasks, color: "bg-green-500", lightColor: "bg-green-50" },
    { title: "Failed", icon: AlertCircle, tasks: failedTasks, color: "bg-red-500", lightColor: "bg-red-50" }
  ];

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
          Error loading tasks. Please try refreshing.
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyTasksList />;
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-2"
      onClick={() => onTaskSelect(task.task_id)}
    >
      <h4 className="font-medium text-sm mb-2 truncate">{task.keywords}</h4>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </div>
        {task.country && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{task.country}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.title} className="border rounded-lg overflow-hidden">
            <div className={`p-3 flex items-center gap-2 ${column.lightColor} border-b`}>
              <div className={`p-1 rounded ${column.color} text-white`}>
                <column.icon className="h-4 w-4" />
              </div>
              <h3 className="font-medium">{column.title}</h3>
              <span className="text-sm ml-1 text-muted-foreground">
                ({column.tasks.length})
              </span>
            </div>
            <div className="p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {column.tasks.length > 0 ? (
                column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  No {column.title.toLowerCase()} tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
