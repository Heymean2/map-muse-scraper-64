
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskDetailErrorProps {
  onRetry: () => void;
}

export default function TaskDetailError({ onRetry }: TaskDetailErrorProps) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 py-12"
    >
      <Card className="p-5 border rounded bg-red-50 text-red-700 flex items-center justify-center flex-col">
        <AlertCircle className="h-10 w-10 mb-4 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Error Loading Results</h3>
          <p className="mb-4">We encountered a problem while fetching your task results.</p>
          <Button 
            variant="destructive" 
            onClick={onRetry} 
            className="gap-2"
          >
            Try Again
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
