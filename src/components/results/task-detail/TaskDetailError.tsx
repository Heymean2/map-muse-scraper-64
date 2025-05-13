
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TaskDetailErrorProps {
  onRetry: () => void;
}

export default function TaskDetailError({ onRetry }: TaskDetailErrorProps) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-16"
    >
      <Card className="p-10 border-0 rounded-2xl bg-gradient-to-b from-white to-slate-50 shadow-md">
        <div className="flex items-center justify-center flex-col text-center">
          <div className="h-24 w-24 bg-red-50/80 rounded-full flex items-center justify-center mb-8">
            <AlertCircle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-2xl font-semibold mb-3 text-slate-800">Error Loading Task</h3>
          <p className="mb-8 text-slate-600 max-w-lg mx-auto leading-relaxed">
            We couldn't retrieve this task's details. This could be due to a network issue or the task may have been deleted.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="destructive" 
              onClick={onRetry} 
              className="gap-2 px-8 rounded-xl shadow-sm"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              asChild
              size="lg"
              className="px-8 rounded-xl"
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
