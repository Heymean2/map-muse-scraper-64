
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedProgressCard from "./EnhancedProgressCard";
import ResultsContent from "@/components/results/ResultsContent";
import TaskInfoCards from "./TaskInfoCards";
import TaskEmptyState from "./TaskEmptyState";
import { getSearchInfo } from "./utils/searchInfoUtils";
import { Button } from "@/components/ui/button";
import { Download, FileJson, Share2 } from "lucide-react";

interface TabbedTaskContentProps {
  taskId: string | null;
  results: any;
  isLoading: boolean;
  error: any;
  isLimited: boolean;
  planInfo: any;
  activeTab: string;
  onExportCsv: () => void;
  onExportJson: () => void;
}

export default function TabbedTaskContent({
  taskId,
  results,
  isLoading,
  error,
  isLimited,
  planInfo,
  activeTab,
  onExportCsv,
  onExportJson,
}: TabbedTaskContentProps) {
  // Get search info
  const searchInfo = getSearchInfo(results);
  
  // Get status and progress
  const taskStatus = results?.status || 'processing';
  const progressValue = results?.progress 
    ? (typeof results.progress === 'number' 
        ? results.progress 
        : parseFloat(results.progress) || 0)
    : taskStatus === 'completed' ? 100 : 50;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Tabs value={activeTab} className="w-full">
        {/* Details Tab */}
        <TabsContent value="details" className="mt-0 space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Task Information Cards */}
            <TaskInfoCards searchInfo={searchInfo} results={results} />
            
            {/* Export Actions */}
            {results?.status === "completed" && (
              <Card className="overflow-hidden border border-slate-200 shadow-sm rounded-lg">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Export Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results?.result_url && (
                      <div className="flex flex-col gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2">
                          <Download className="text-blue-600 h-5 w-5" />
                          <h4 className="font-medium">CSV Export</h4>
                        </div>
                        <p className="text-sm text-slate-600">Download data in CSV format for use with spreadsheet applications.</p>
                        <Button 
                          onClick={onExportCsv}
                          className="mt-2 gap-1.5"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download CSV</span>
                        </Button>
                      </div>
                    )}
                    
                    {results?.json_result_url && (
                      <div className="flex flex-col gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2">
                          <FileJson className="text-violet-primary h-5 w-5" />
                          <h4 className="font-medium">JSON Export</h4>
                        </div>
                        <p className="text-sm text-slate-600">Download data in JSON format for use with programming applications.</p>
                        <Button 
                          onClick={onExportJson}
                          className="mt-2 gap-1.5"
                          variant="outline"
                        >
                          <FileJson className="h-4 w-4" />
                          <span>Download JSON</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="ghost"
                      className="gap-1.5"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share Results Link</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>
        
        {/* Data Tab */}
        <TabsContent value="data" className="mt-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden border border-slate-200 shadow-sm rounded-lg">
              <CardContent className="p-0">
                {results?.status === "completed" && (!results?.data || !results?.data?.length) ? (
                  <TaskEmptyState 
                    results={results} 
                    getExportCsvHandler={() => onExportCsv} 
                    getExportJsonHandler={() => onExportJson} 
                    searchInfo={searchInfo}
                  />
                ) : (
                  <ResultsContent 
                    loading={isLoading}
                    error={error} 
                    taskId={taskId} 
                    results={results}
                    exportCSV={onExportCsv}
                    isLimited={isLimited}
                    planInfo={planInfo}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="mt-0">
          {taskStatus === 'processing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <EnhancedProgressCard 
                progress={progressValue} 
                status={taskStatus}
                stage={results?.stage}
                detailedState={results?.current_state}
                createdAt={results?.created_at}
                estimatedTimeRemaining="3 minutes"
                currentStep={
                  taskStatus === 'completed' ? 5 :
                  results?.stage === 'exporting' ? 4 :
                  results?.stage === 'processing' ? 3 :
                  results?.stage === 'collecting' ? 2 : 1
                }
              />
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
