
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileX, ArrowLeft } from "lucide-react";

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
      className="max-w-5xl mx-auto px-4 py-12 text-center"
    >
      <Card className="p-8 shadow-sm">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-6">
          <FileX className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-medium mb-2 text-gray-800">No Task Data Available</h3>
        <p className="mb-6 text-gray-600 max-w-lg mx-auto">{message}</p>
        
        <Button 
          onClick={() => navigate('/dashboard/results')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Results
        </Button>
      </Card>
    </motion.div>
  );
}
