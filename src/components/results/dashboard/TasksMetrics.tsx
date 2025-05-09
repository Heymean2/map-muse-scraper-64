
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TasksMetricsProps {
  totalTasks: number;
  completedTasks: number;
  processingTasks: number;
  failedTasks: number;
  isLoading: boolean;
}

export default function TasksMetrics({
  totalTasks,
  completedTasks,
  processingTasks,
  failedTasks,
  isLoading
}: TasksMetricsProps) {
  const metrics = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Search,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Processing",
      value: processingTasks,
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Failed",
      value: failedTasks,
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="relative overflow-hidden">
          <div className={`absolute right-0 top-0 w-1 h-full ${metric.color}`}></div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{metric.value}</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
