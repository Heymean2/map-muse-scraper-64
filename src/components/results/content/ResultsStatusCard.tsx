
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Download, Eye, Trophy, MapPin, FileJson, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import CSVPreview from "../CSVPreview";
import SearchInfoCard from "../SearchInfoCard";

interface ResultsStatusCardProps {
  status: string;
  created_at?: string;
  search_info?: any;
  total_count?: number;
  result_url?: string;
  json_result_url?: string;
  isLimited: boolean;
  updated_at?: string;
  onShowCsvPreview: () => void;
  onShowJsonPreview: () => void;
  onDownload: () => void;
  onDownloadJson?: () => void;
}

export default function ResultsStatusCard({
  status,
  created_at,
  search_info,
  total_count = 0,
  result_url,
  json_result_url,
  isLimited,
  updated_at,
  onShowCsvPreview,
  onShowJsonPreview,
  onDownload,
  onDownloadJson
}: ResultsStatusCardProps) {
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    navigate("/dashboard/billing");
  };

  if (status === "processing") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 flex flex-col items-center text-center gap-4">
            <Clock className="h-12 w-12 text-blue-500 animate-pulse" />
            <h3 className="text-xl font-medium text-blue-700 dark:text-blue-400">
              Processing Your Data
            </h3>
            <p className="text-blue-700 dark:text-blue-400">
              Your scraping task is still running. The page will refresh automatically when results are ready.
            </p>
            <div className="w-full max-w-md bg-blue-100 dark:bg-blue-800/30 rounded-full h-2.5 my-2">
              <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-500">
              Started: {created_at ? format(new Date(created_at), 'MMM d, yyyy HH:mm') : 'Recently'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "completed" && (!search_info?.data || !search_info?.data?.length)) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 flex flex-col items-center text-center gap-4">
            <Badge className="bg-green-500">Completed</Badge>
            <h3 className="text-xl font-medium text-green-700 dark:text-green-400">
              Task Completed Successfully
            </h3>
            <p className="text-green-700 dark:text-green-400">
              Your data is ready to be downloaded. No preview is available, but you can download the full files.
            </p>
            
            {!isLimited && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-md">
                <div className="flex-1 border rounded-md p-3 bg-white">
                  <div className="font-medium mb-1 flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>CSV</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {result_url && (
                      <>
                        <Button 
                          className="w-full gap-2 text-sm" 
                          onClick={onDownload}
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                          Download CSV
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="w-full gap-2 text-sm" 
                          onClick={onShowCsvPreview}
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      </>
                    )}
                    {!result_url && (
                      <p className="text-sm text-gray-500">CSV not available</p>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 border rounded-md p-3 bg-white">
                  <div className="font-medium mb-1 flex items-center gap-1.5">
                    <FileJson className="h-4 w-4" />
                    <span>JSON</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {json_result_url && onDownloadJson && (
                      <>
                        <Button 
                          className="w-full gap-2 text-sm" 
                          onClick={onDownloadJson}
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                          Download JSON
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="w-full gap-2 text-sm" 
                          onClick={onShowJsonPreview}
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      </>
                    )}
                    {!json_result_url && (
                      <p className="text-sm text-gray-500">JSON not available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {isLimited && (
              <Button 
                className="gap-2" 
                onClick={handleUpgradeClick}
              >
                <Trophy className="h-4 w-4" />
                Upgrade Now
              </Button>
            )}
          </div>
          
          <div className="mt-6">
            <SearchInfoCard 
              totalCount={total_count || 0} 
              searchInfo={{
                keywords: search_info?.keywords,
                location: search_info?.location,
                fields: search_info?.fields,
                rating: search_info?.rating
              }}
              completedAt={updated_at}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
