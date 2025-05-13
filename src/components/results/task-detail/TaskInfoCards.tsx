
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
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

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg font-medium">Search Information</CardTitle>
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
      
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg font-medium">Results</CardTitle>
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
          
          {/* Status Badge */}
          <div className="flex justify-between pt-2 border-t border-slate-100">
            <span className="text-sm text-slate-500">Status</span>
            <Badge className={getStatusColor(taskStatus)}>
              {taskStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Only show Processing Status card when status is processing */}
      {taskStatus === 'processing' && (
        <Card className="md:col-span-2">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg font-medium">Processing Status</CardTitle>
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
                className="animate-pulse"
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
      )}
    </div>
  );
}
