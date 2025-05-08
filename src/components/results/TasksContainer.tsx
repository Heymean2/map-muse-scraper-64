
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TasksFilter from './TasksFilter';
import TasksList from './TasksList';
import { ScrapingRequest } from '@/services/scraper';

interface TasksContainerProps {
  isLoading: boolean;
  error: unknown;
  tasks: ScrapingRequest[];
  onTaskSelect: (taskId: string) => void;
}

export default function TasksContainer({
  isLoading,
  error,
  tasks,
  onTaskSelect
}: TasksContainerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              {tasks?.length 
                ? `${tasks.length} total tasks` 
                : 'No tasks found'}
            </CardDescription>
          </div>
          <TasksFilter />
        </div>
      </CardHeader>
      <CardContent>
        <TasksList 
          isLoading={isLoading} 
          error={error} 
          tasks={tasks} 
          onTaskSelect={onTaskSelect} 
        />
      </CardContent>
    </Card>
  );
}
