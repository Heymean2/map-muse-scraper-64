
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileX, ArrowLeft, Search } from "lucide-react";

interface TaskNoDataStateProps {
  message?: string;
}

export default function TaskDetailNoData({ message = "We couldn't find any information for this task." }: TaskNoDataStateProps) {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 py-16"
    >
      <Card className="p-12 shadow-sm border border-slate-200 rounded-xl bg-white text-center">
        <div className="flex flex-col items-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-8">
            <FileX className="h-10 w-10" />
          </div>
          
          <h3 className="text-2xl font-medium mb-3 text-slate-800">No Task Data Available</h3>
          <p className="mb-8 text-slate-600 max-w-md mx-auto">{message}</p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dashboard/results')}
              className="gap-2 px-6"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Results
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="gap-2 px-6"
            >
              <Search className="h-4 w-4" />
              Start New Search
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
