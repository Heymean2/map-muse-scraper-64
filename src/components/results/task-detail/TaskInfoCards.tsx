
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, FileText, Database } from "lucide-react";
import { getStatusColor } from "./utils/statusUtils";
import { format } from "date-fns";

interface TaskInfoCardsProps {
  searchInfo: any;
  results: any;
}

export default function TaskInfoCards({ searchInfo, results }: TaskInfoCardsProps) {
  // Helper function to parse progress value
  const getProgressValue = (): number => {
    if (!results) return 0;
    
    if (typeof results.progress === 'number') {
      return results.progress;
    }
    
    if (typeof results.progress === 'string') {
      return parseFloat(results.progress) || 0;
    }
    
    // Default based on status
    if (results.status === 'completed') return 100;
    if (results.status === 'processing') return 50;
    return 0;
  };
  
  // Parse current progress
  const progressValue = getProgressValue();
  
  // Get task status
  const taskStatus = results?.status || 'processing';
  
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card className="h-full">
          <CardHeader className="bg-slate-50 border-b py-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-medium">Search Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {searchInfo?.keywords && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Keywords</span>
                <span className="text-sm font-medium">{searchInfo.keywords}</span>
              </div>
            )}
            
            {searchInfo?.location && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Location</span>
                <span className="text-sm font-medium">{searchInfo.location}</span>
              </div>
            )}
            
            {searchInfo?.fields && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Fields</span>
                <span className="text-sm font-medium">
                  {Array.isArray(searchInfo.fields) 
                    ? searchInfo.fields.join(", ")
                    : typeof searchInfo.fields === 'string'
                      ? searchInfo.fields
                      : ''}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="h-full">
          <CardHeader className="bg-slate-50 border-b py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base font-medium">Results</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Total Count</span>
              <span className="text-sm font-medium">{results?.total_count || results?.row_count || 0} results</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Available Formats</span>
              <div className="flex gap-2">
                {results?.result_url && (
                  <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">CSV</Badge>
                )}
                {results?.json_result_url && (
                  <Badge variant="outline" className="text-purple-500 border-purple-200 bg-purple-50">JSON</Badge>
                )}
              </div>
            </div>
            
            {results?.updated_at && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Completed At</span>
                <span className="text-sm font-medium">
                  {new Date(results.updated_at).toLocaleString()}
                </span>
              </div>
            )}
            
            {results?.created_at && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Created At</span>
                <span className="text-sm font-medium">
                  {new Date(results.created_at).toLocaleString()}
                </span>
              </div>
            )}
            
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-500">Status</span>
              <Badge className={getStatusColor(taskStatus)}>
                {taskStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Only show Processing Status card when status is processing */}
      {taskStatus === 'processing' && (
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="border-blue-100">
            <CardHeader className="bg-blue-50 border-b border-blue-100 py-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-base font-medium">Processing Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Stage */}
              {results?.stage && results.stage !== results.status && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Current Stage</span>
                  <span className="text-sm font-medium capitalize">{results.stage}</span>
                </div>
              )}
              
              {results?.current_state && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Current State</span>
                  <span className="text-sm font-medium">{results.current_state}</span>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progressValue)}%</span>
                </div>
                <Progress 
                  value={progressValue} 
                  className="h-1.5"
                  indicatorClassName="bg-blue-500"
                />
              </div>
              
              {results?.created_at && (
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                  <Clock className="h-3 w-3" />
                  <span>Started {format(new Date(results.created_at), "MMM d, yyyy HH:mm")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
