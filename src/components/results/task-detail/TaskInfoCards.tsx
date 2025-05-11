
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskInfoCardsProps {
  searchInfo: any;
  results: any;
}

export default function TaskInfoCards({ searchInfo, results }: TaskInfoCardsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Search Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        <CardHeader>
          <CardTitle className="text-lg font-medium">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Total Count</span>
            <span className="text-sm font-medium">{results?.total_count || 0} results</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
