
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: {
    task_id: string;
    keywords: string;
    country?: string;
    states?: string;
    status?: string;
    created_at: string;
    total_results?: number;
  };
  onSelect: (taskId: string) => void;
}

export default function TaskItem({ task, onSelect }: TaskItemProps) {
  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => onSelect(task.task_id)}
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
          </span>
        </div>
      </div>
      {task.total_results !== undefined && (
        <div className="mt-2 text-sm">
          <span className="text-slate-600 font-medium">{task.total_results}</span> results found
        </div>
      )}
    </div>
  );
}
