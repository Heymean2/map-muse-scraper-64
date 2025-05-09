
import { useState } from "react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths } from "date-fns";
import { Check, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  task_id: string;
  keywords: string;
  created_at: string;
  status: "processing" | "completed" | "failed";
  country?: string;
  states?: string;
}

interface TasksCalendarViewProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskSelect: (taskId: string) => void;
}

interface TasksByDate {
  [date: string]: Task[];
}

export default function TasksCalendarView({
  tasks,
  isLoading,
  onTaskSelect
}: TasksCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  // Group tasks by date
  const tasksByDate = tasks.reduce<TasksByDate>((acc, task) => {
    const date = format(new Date(task.created_at), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-amber-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  const renderDayCell = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasksByDate[dateKey] || [];
    const isToday = isSameDay(day, new Date());
    
    return (
      <div 
        key={dateKey}
        className={`border p-2 min-h-[100px] ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
      >
        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''} mb-1`}>
          {format(day, 'd')}
        </div>
        
        <div className="space-y-1">
          {isLoading ? (
            <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
          ) : (
            dayTasks.map((task) => (
              <div 
                key={task.id}
                className="text-xs p-1 rounded bg-white border shadow-sm cursor-pointer hover:shadow-md transition-shadow truncate"
                onClick={() => onTaskSelect(task.task_id)}
              >
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                  <span className="truncate">{task.keywords}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  const renderWeekdayHeader = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7">
        {weekdays.map((day) => (
          <div key={day} className="p-2 text-center font-medium text-sm bg-slate-50">
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        {renderWeekdayHeader()}
        <div className="grid grid-cols-7">
          {daysInMonth.map(day => renderDayCell(day))}
        </div>
      </div>
    </div>
  );
}
