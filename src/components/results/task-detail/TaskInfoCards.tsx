
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, FileText, Database, Calendar } from "lucide-react";
import { getStatusColor } from "./utils/statusUtils";
import { format, formatDistanceToNow } from "date-fns";

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
      className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card className="h-full rounded-2xl shadow-md border-0 overflow-hidden bg-gradient-to-b from-white to-slate-50">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-subtle flex items-center justify-center">
                <MapPin className="h-5 w-5 text-violet-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Search Information</h3>
            </div>
            
            {searchInfo?.keywords && (
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Keywords</span>
                <span className="text-sm font-medium text-slate-800">{searchInfo.keywords}</span>
              </div>
            )}
            
            {searchInfo?.location && (
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Location</span>
                <span className="text-sm font-medium text-slate-800">{searchInfo.location}</span>
              </div>
            )}
            
            {searchInfo?.fields && (
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Fields</span>
                <span className="text-sm font-medium text-slate-800">
                  {Array.isArray(searchInfo.fields) 
                    ? searchInfo.fields.join(", ")
                    : typeof searchInfo.fields === 'string'
                      ? searchInfo.fields
                      : ''}
                </span>
              </div>
            )}
            
            {results?.created_at && (
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm text-slate-500 font-medium">Created</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-slate-800">
                    {format(new Date(results.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="h-full rounded-2xl shadow-md border-0 overflow-hidden bg-gradient-to-b from-white to-slate-50">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Results Information</h3>
            </div>
            
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 font-medium">Total Count</span>
              <span className="text-sm font-semibold text-slate-800">{results?.total_count || results?.row_count || 0} results</span>
            </div>
            
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-500 font-medium">Available Formats</span>
              <div className="flex gap-2">
                {results?.result_url && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-md">CSV</Badge>
                )}
                {results?.json_result_url && (
                  <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-md">JSON</Badge>
                )}
                {!results?.result_url && !results?.json_result_url && (
                  <span className="text-sm text-slate-500">None yet</span>
                )}
              </div>
            </div>
            
            {results?.updated_at && (
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Completed At</span>
                <span className="text-sm font-medium text-slate-800">
                  {format(new Date(results.updated_at), "MMM d, yyyy HH:mm")}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2.5">
              <span className="text-sm text-slate-500 font-medium">Status</span>
              <Badge className={`${getStatusColor(taskStatus)} px-3 ${taskStatus === "processing" ? "animate-pulse" : ""} rounded-md`}>
                {taskStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Only show Processing Status card when status is processing */}
      {taskStatus === 'processing' && (
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="border-0 rounded-2xl shadow-md overflow-hidden bg-blue-50/50">
            <CardContent className="p-8 space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Processing Details</h3>
              </div>
              
              {/* Stage */}
              {results?.stage && results.stage !== results.status && (
                <div className="flex justify-between items-center py-2.5 border-b border-blue-100/50">
                  <span className="text-sm text-slate-600 font-medium">Current Stage</span>
                  <span className="text-sm font-medium capitalize text-slate-800">{results.stage}</span>
                </div>
              )}
              
              {results?.current_state && (
                <div className="flex justify-between items-center py-2.5 border-b border-blue-100/50">
                  <span className="text-sm text-slate-600 font-medium">Current State</span>
                  <span className="text-sm font-medium text-slate-800">{results.current_state}</span>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Progress</span>
                  <span className="font-semibold text-slate-800">{Math.round(progressValue)}%</span>
                </div>
                <Progress 
                  value={progressValue} 
                  className="h-4 rounded-full bg-blue-100"
                  indicatorClassName="bg-blue-600 rounded-full"
                />
              </div>
              
              {results?.created_at && (
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-3 py-2.5">
                  <Clock className="h-4 w-4" strokeWidth={1.5} />
                  <span>Started {formatDistanceToNow(new Date(results.created_at), { addSuffix: true })}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
