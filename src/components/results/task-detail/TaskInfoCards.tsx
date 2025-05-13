
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
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card className="h-full rounded-lg shadow-sm border border-slate-200 overflow-hidden bg-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-violet-subtle flex items-center justify-center">
                <MapPin className="h-4 w-4 text-violet-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-md font-medium text-slate-800">Search Information</h3>
            </div>
            
            {searchInfo?.keywords && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Keywords</span>
                <span className="text-sm font-medium text-slate-800">{searchInfo.keywords}</span>
              </div>
            )}
            
            {searchInfo?.location && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Location</span>
                <span className="text-sm font-medium text-slate-800">{searchInfo.location}</span>
              </div>
            )}
            
            {searchInfo?.fields && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
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
              <div className="flex justify-between items-center py-2">
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
        <Card className="h-full rounded-lg shadow-sm border border-slate-200 overflow-hidden bg-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-md font-medium text-slate-800">Results Information</h3>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500 font-medium">Total Count</span>
              <span className="text-sm font-semibold text-slate-800">{results?.total_count || results?.row_count || 0} results</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
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
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Completed At</span>
                <span className="text-sm font-medium text-slate-800">
                  {format(new Date(results.updated_at), "MMM d, yyyy HH:mm")}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500 font-medium">Status</span>
              <Badge className={`${getStatusColor(taskStatus)} px-3 ${taskStatus === "processing" ? "animate-pulse" : ""} rounded-md`}>
                {taskStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
