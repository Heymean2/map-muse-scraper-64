
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TaskDetailErrorProps {
  onRetry: () => void;
}

export default function TaskDetailError({ onRetry }: TaskDetailErrorProps) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 py-12"
    >
      <Card className="p-8 border rounded bg-white text-gray-700 shadow-sm">
        <div className="flex items-center justify-center flex-col text-center">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          
          <h3 className="text-xl font-medium mb-2">Error Loading Task</h3>
          <p className="mb-6 text-gray-600 max-w-md">We couldn't retrieve this task's details. This could be due to a network issue or the task may have been deleted.</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="destructive" 
              onClick={onRetry} 
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              asChild
            >
              <Link to="/dashboard/results" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Results
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
