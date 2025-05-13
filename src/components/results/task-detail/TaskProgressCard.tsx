
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
        return <CheckCircle className="h-6 w-6 text-green-500" strokeWidth={1.5} />;
      case 'processing':
        return <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" strokeWidth={1.5} />;
      case 'failed':
        return <AlertCircle className="h-6 w-6 text-red-500" strokeWidth={1.5} />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" strokeWidth={1.5} />;
    }
  };
  
  const stages = ['queued', 'collecting', 'processing', 'exporting', 'completed'];
  const currentStageIndex = stages.indexOf(progress.currentStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 overflow-hidden border-0 rounded-2xl shadow-md bg-gradient-to-b from-white to-slate-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <h3 className="text-xl font-semibold text-slate-800 capitalize">
                {progress.detailedState || status}
              </h3>
            </div>
            <span className="text-sm text-slate-500">
              {createdAt && `Started ${formatDistanceToNow(new Date(createdAt), { addSuffix: true })}`}
            </span>
          </div>
          
          <div className="mb-3">
            <Progress 
              value={progress.percentage} 
              className="h-4 rounded-full bg-slate-100"
              indicatorClassName={`${getStatusColor()} rounded-full`}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm text-slate-600 mb-8">
            <span className="font-medium">{Math.round(progress.percentage)}% complete</span>
            <span className="capitalize">{progress.currentStage}</span>
          </div>
          
          {/* Stage Timeline */}
          <div className="flex items-center justify-between relative mt-10">
            {/* Connector line for timeline */}
            <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>
            
            {stages.map((stage, index) => {
              const isCompleted = currentStageIndex >= index;
              const isCurrent = progress.currentStage === stage;
              
              return (
                <div key={stage} className="flex flex-col items-center z-10 px-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent ? getStatusColor() : 
                    isCompleted ? 'bg-green-100 border border-green-200' : 'bg-slate-100 border border-slate-200'
                  }`}>
                    {isCompleted && !isCurrent && (
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    )}
                    {isCurrent && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${isCurrent ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
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
