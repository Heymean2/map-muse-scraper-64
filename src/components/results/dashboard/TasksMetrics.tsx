
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
      color: "text-google-blue",
      bgColor: "bg-google-blue/10",
      borderColor: "border-google-blue/50",
      ringClass: "before:ring-google-blue/20"
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-google-green",
      bgColor: "bg-google-green/10",
      borderColor: "border-google-green/50",
      ringClass: "before:ring-google-green/20"
    },
    {
      title: "Processing",
      value: processingTasks,
      icon: Clock,
      color: "text-google-yellow",
      bgColor: "bg-google-yellow/10",
      borderColor: "border-google-yellow/50",
      ringClass: "before:ring-google-yellow/20"
    },
    {
      title: "Failed",
      value: failedTasks,
      icon: AlertCircle,
      color: "text-google-red",
      bgColor: "bg-google-red/10",
      borderColor: "border-google-red/50",
      ringClass: "before:ring-google-red/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.title} 
          className={`relative overflow-hidden transition-all hover:shadow-md border ${metric.borderColor} hover:translate-y-[-2px] duration-300`}
        >
          <div className={`absolute left-0 top-0 h-full w-1 ${metric.bgColor}`}></div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${metric.bgColor} ${metric.color}`}>
                {metric.title}
              </div>
            </div>
            <div className="mt-3">
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
