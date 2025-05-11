
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface TaskEmptyStateProps {
  results: any;
  getExportCsvHandler: () => () => void;
  getExportJsonHandler: () => () => void;
  searchInfo: any;
}

export default function TaskEmptyState({
  results,
  getExportCsvHandler,
  getExportJsonHandler,
  searchInfo
}: TaskEmptyStateProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="overflow-hidden border bg-white shadow-sm">
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Task Completed Successfully</h2>
            <p className="text-gray-600 max-w-lg mb-8">
              Your data is ready to be downloaded. No preview is available, but you can download the full files.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              {results.result_url && (
                <div className="border rounded-md p-4 bg-white">
                  <h4 className="font-medium mb-2 flex items-center gap-1.5">CSV Format</h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="gap-2" 
                      onClick={getExportCsvHandler()}
                    >
                      <Download className="h-4 w-4" />
                      Download CSV
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        // This is just a placeholder since we can't directly preview from this view
                        window.open(results.result_url, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Preview CSV
                    </Button>
                  </div>
                </div>
              )}
              
              {results.json_result_url && (
                <div className="border rounded-md p-4 bg-white">
                  <h4 className="font-medium mb-2 flex items-center gap-1.5">JSON Format</h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="gap-2" 
                      onClick={getExportJsonHandler()}
                    >
                      <Download className="h-4 w-4" />
                      Download JSON
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        // This is just a placeholder since we can't directly preview from this view
                        window.open(results.json_result_url, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Preview JSON
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
