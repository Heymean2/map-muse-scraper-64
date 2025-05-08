
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, FileText, Filter, MapPin, Plus, Search, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface Task {
  id: string;
  task_id: string;
  keywords: string;
  created_at: string;
  status: "processing" | "completed" | "failed";
  country?: string;
  states?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter tasks based on search query and active tab
  const filteredTasks = userTasks.filter(task => {
    const matchesSearch = task.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      activeTab === "all" ? true : 
      activeTab === "completed" ? task.status === "completed" : 
      activeTab === "processing" ? task.status === "processing" : 
      false;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-slate-800 h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Your Scraping Tasks</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
            <TabsTrigger value="processing" className="flex-1">Processing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="overflow-y-auto flex-grow p-4">
        {tasksLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-6">
            {searchQuery ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No tasks matching "{searchQuery}"
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No {activeTab !== "all" ? activeTab : ""} tasks found
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`p-4 rounded-lg border ${task.task_id === currentTaskId ? 
                  'bg-primary/10 border-primary' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'} 
                  hover:border-primary cursor-pointer transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium line-clamp-1">{task.keywords}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Clock size={12} className="mr-1" />
                        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                      </div>
                      
                      {task.country && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <MapPin size={12} className="mr-1" />
                          {task.country}
                        </div>
                      )}
                    </div>
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
      </div>
      
      <div className="p-4 border-t mt-auto">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/dashboard/scrape")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Scraping Task
        </Button>
      </div>
    </div>
  );
}
