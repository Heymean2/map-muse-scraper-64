
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";

interface EnhancedProgressCardProps {
  progress: number;
  status: string;
  stage?: string;
  detailedState?: string;
  createdAt?: string;
  estimatedTimeRemaining?: string;
  currentStep?: number;
  totalSteps?: number;
}

export default function EnhancedProgressCard({ 
  progress, 
  status, 
  stage, 
  detailedState,
  createdAt,
  estimatedTimeRemaining,
  currentStep = 2,
  totalSteps = 5
}: EnhancedProgressCardProps) {
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
        return <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={1.5} />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" strokeWidth={1.5} />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" strokeWidth={1.5} />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" strokeWidth={1.5} />;
    }
  };
  
  // Define our workflow steps
  const workflowSteps = [
    { id: 'queued', label: 'Queued', icon: <Clock className="h-3.5 w-3.5" /> },
    { id: 'collecting', label: 'Collecting', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'processing', label: 'Processing', icon: <RefreshCw className="h-3.5 w-3.5" /> },
    { id: 'exporting', label: 'Exporting', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle className="h-3.5 w-3.5" /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="overflow-hidden border border-slate-200 shadow-sm rounded-lg">
        <CardHeader className="bg-slate-50 pb-2 pt-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <CardTitle className="text-lg font-medium">Task Progress</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {createdAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Started {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Status & Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {detailedState || stage || status}
                  </span>
                  {estimatedTimeRemaining && (
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      ~{estimatedTimeRemaining} remaining
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-800">{Math.round(progress)}%</span>
              </div>
              
              <Progress 
                value={progress} 
                className="h-2 rounded-full bg-slate-100"
                indicatorClassName={`${getStatusColor()} rounded-full`}
              />
            </div>
            
            {/* Interactive timeline */}
            <div className="pt-4">
              <div className="flex items-center justify-between relative">
                {/* Connector line */}
                <div className="absolute top-4 left-0 h-[2px] bg-slate-200 w-full -z-10"></div>
                
                {workflowSteps.map((step, index) => {
                  const isActive = index + 1 <= currentStep;
                  const isCurrent = index + 1 === currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${isCurrent 
                          ? getStatusColor() 
                          : isActive 
                            ? 'bg-green-100 border border-green-200' 
                            : 'bg-slate-100 border border-slate-200'
                        }
                      `}>
                        <div className={`
                          ${isCurrent 
                            ? 'text-white' 
                            : isActive 
                              ? 'text-green-600'
                              : 'text-slate-400'
                          }
                        `}>
                          {step.icon}
                        </div>
                      </div>
                      <span className={`text-xs mt-1.5 whitespace-nowrap
                        ${isCurrent 
                          ? 'font-medium text-slate-800' 
                          : isActive
                            ? 'font-medium text-slate-700'
                            : 'text-slate-500'
                        }
                      `}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh Status</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
