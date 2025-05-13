
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search, CheckCircle, FileText } from "lucide-react";
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
    <div className="py-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-b from-white to-slate-50 shadow-md rounded-2xl">
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
              <CheckCircle className="h-10 w-10" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">Task Completed Successfully</h2>
            <p className="text-slate-600 max-w-lg mb-8 leading-relaxed">
              Your search was completed successfully, but there were no results to display. You can download the empty file or start a new search.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
              {results.result_url && (
                <Card className="border-blue-100 p-5 bg-blue-50/50 rounded-xl shadow-sm">
                  <h4 className="font-medium mb-4 flex items-center gap-2 text-blue-700">
                    <FileText className="h-4 w-4" strokeWidth={1.5} />
                    CSV Format
                  </h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg" 
                      onClick={getExportCsvHandler()}
                    >
                      <Download className="h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                </Card>
              )}
              
              {results.json_result_url && (
                <Card className="border-purple-100 p-5 bg-purple-50/50 rounded-xl shadow-sm">
                  <h4 className="font-medium mb-4 flex items-center gap-2 text-purple-700">
                    <FileText className="h-4 w-4" strokeWidth={1.5} />
                    JSON Format
                  </h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="gap-2 bg-purple-600 hover:bg-purple-700 rounded-lg" 
                      onClick={getExportJsonHandler()}
                    >
                      <Download className="h-4 w-4" />
                      Download JSON
                    </Button>
                  </div>
                </Card>
              )}
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="gap-2 rounded-lg"
                size="lg"
                asChild
              >
                <Link to="/">
                  <Search className="h-4 w-4" />
                  Start New Search
                </Link>
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
