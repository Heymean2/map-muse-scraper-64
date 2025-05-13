
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ScrapingRequest } from '@/services/scraper/types';
import { Progress } from '@/components/ui/progress';
import { parseProgressValue } from '@/services/scraper/taskRetrieval';

interface TaskItemProps {
  task: ScrapingRequest;
  onSelect: (taskId: string) => void;
}

export default function TaskItem({ task, onSelect }: TaskItemProps) {
  // Determine the total count from either total_count or row_count
  const totalCount = task.total_count !== undefined ? task.total_count : task.row_count;
  
  // Get progress percentage
  const progress = parseProgressValue(task.progress);
  
  // Get progress color based on status
  const getProgressColor = () => {
    switch(task.status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => task.task_id && onSelect(task.task_id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{task.keywords}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {task.country} {task.states && `- ${task.states}`} • Created: {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 text-xs rounded-full ${
            task.status === 'completed' ? 'bg-green-100 text-green-800' : 
            task.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {task.status}
            {task.stage && task.stage !== task.status && ` (${task.stage})`}
          </span>
        </div>
      </div>
      
      {/* Progress bar for tasks in progress */}
      {task.status === 'processing' && (
        <div className="mt-3">
          <Progress 
            value={progress} 
            className="h-1.5 animate-pulse" 
            indicatorClassName={getProgressColor()}
          />
        </div>
      )}
      
      {totalCount !== undefined && (
        <div className="mt-2 text-sm">
          <span className="text-slate-600 font-medium">{totalCount}</span> results found
        </div>
      )}
      
      {task.current_state && task.current_state !== task.status && task.current_state !== task.stage && (
        <div className="mt-2 text-xs text-slate-500">
          {task.current_state}
        </div>
      )}
    </div>
  );
}
