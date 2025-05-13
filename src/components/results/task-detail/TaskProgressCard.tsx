
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskProgress } from '@/services/scraper/types';
import { Clock, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskProgressCardProps {
  progress: TaskProgress;
  status: string;
  createdAt?: string;
}

export default function TaskProgressCard({ progress, status, createdAt }: TaskProgressCardProps) {
  // Status-specific styling
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Status-specific icon
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <RefreshCcw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h3 className="font-medium capitalize">
              {progress.detailedState || status}
            </h3>
          </div>
          <span className="text-sm text-slate-500">
            {createdAt && `Started ${formatDistanceToNow(new Date(createdAt), { addSuffix: true })}`}
          </span>
        </div>
        
        <div className="mb-2">
          <Progress 
            value={progress.percentage} 
            className="h-2" 
            indicatorClassName={getStatusColor()}
          />
        </div>
        
        <div className="flex justify-between items-center text-xs text-slate-600">
          <span>{Math.round(progress.percentage)}% complete</span>
          <span className="capitalize">{progress.currentStage}</span>
        </div>
        
        {/* Stage Timeline */}
        <div className="mt-5 flex items-center justify-between">
          {['queued', 'collecting', 'processing', 'exporting', 'completed'].map((stage, index) => {
            const isCompleted = progress.previousStages?.includes(stage) || progress.currentStage === stage;
            const isCurrent = progress.currentStage === stage;
            
            return (
              <div key={stage} className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  isCurrent ? getStatusColor() : 
                  isCompleted ? 'bg-green-200' : 'bg-gray-200'
                } flex items-center justify-center`}>
                  {isCompleted && !isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className={`text-xs mt-1 ${isCurrent ? 'font-medium' : ''}`}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </span>
                
                {/* Connector line */}
                {index < 4 && (
                  <div className="absolute w-1/5 h-0.5 bg-gray-200 -z-10" style={{
                    left: `${(index * 20) + 10}%`,
                    width: '20%'
                  }}></div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
