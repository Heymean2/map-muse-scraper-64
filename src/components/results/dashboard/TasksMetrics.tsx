
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, Search, MapPin } from "lucide-react";
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
      icon: MapPin,
      color: "text-violet-primary",
      bgColor: "bg-primary-subtle",
      borderColor: "border-primary-subtle",
      ringClass: "before:ring-violet-primary/10"
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-google-green",
      bgColor: "bg-secondary-subtle",
      borderColor: "border-secondary-subtle",
      ringClass: "before:ring-google-green/10"
    },
    {
      title: "Processing",
      value: processingTasks,
      icon: Clock,
      color: "text-google-yellow",
      bgColor: "bg-warning-subtle",
      borderColor: "border-warning-subtle",
      ringClass: "before:ring-google-yellow/10"
    },
    {
      title: "Failed",
      value: failedTasks,
      icon: AlertCircle,
      color: "text-google-red",
      bgColor: "bg-accent-subtle",
      borderColor: "border-accent-subtle",
      ringClass: "before:ring-google-red/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.title} 
          className={`conversion-card overflow-hidden transition-all hover:shadow-card-hover border-slate-100 hover:translate-y-[-2px] duration-300`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${metric.bgColor} ${metric.color}`}>
                {metric.title}
              </div>
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="flex items-end gap-2">
                  <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                  {metric.title === "Processing" && metric.value > 0 && (
                    <div className={`w-2 h-2 rounded-full ${metric.color === 'text-google-yellow' ? 'bg-google-yellow' : metric.color} animate-pulse mb-2`}></div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={`absolute inset-0 pointer-events-none ${metric.ringClass} before:absolute before:inset-0 before:rounded-xl before:ring-1 before:ring-inset opacity-0 hover:opacity-100 transition-opacity duration-500`}></div>
        </Card>
      ))}
    </div>
  );
}
