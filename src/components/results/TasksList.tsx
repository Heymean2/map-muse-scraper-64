
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskItem from './TaskItem';
import EmptyTasksList from './EmptyTasksList';
import { ScrapingRequest } from "@/services/scraper";

interface TasksListProps {
  isLoading: boolean;
  error: unknown;
  tasks: ScrapingRequest[];
  onTaskSelect: (taskId: string) => void;
}

export default function TasksList({ isLoading, error, tasks, onTaskSelect }: TasksListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded bg-red-50 text-red-700">
        Error loading tasks. Please try again later.
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyTasksList />;
  }

  return (
    <>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskItem 
            key={task.task_id} 
            task={task} 
            onSelect={onTaskSelect} 
          />
        ))}
      </div>
    </>
  );
}
