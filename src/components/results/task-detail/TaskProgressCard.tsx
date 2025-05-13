
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskProgress } from '@/services/scraper/types';
import { Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from "framer-motion";

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
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const stages = ['queued', 'collecting', 'processing', 'exporting', 'completed'];
  const currentStageIndex = stages.indexOf(progress.currentStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 overflow-hidden border shadow-sm bg-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <h3 className="font-medium text-slate-800 capitalize">
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
          <div className="mt-5 flex items-center justify-between relative">
            {/* Connector line for timeline */}
            <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10"></div>
            
            {stages.map((stage, index) => {
              const isCompleted = currentStageIndex >= index;
              const isCurrent = progress.currentStage === stage;
              
              return (
                <div key={stage} className="flex flex-col items-center z-10">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isCurrent ? getStatusColor() : 
                    isCompleted ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                    {isCompleted && !isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 ${isCurrent ? 'font-medium' : 'text-slate-500'}`}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
