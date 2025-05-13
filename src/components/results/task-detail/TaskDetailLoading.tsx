
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailLoading() {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 py-6 space-y-6"
    >
      {/* Header skeleton */}
      <div className="space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      {/* Progress Card */}
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 animate-pulse"></div>
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Loading progress bar */}
          <div className="mb-3">
            <Progress value={30} className="h-2" indicatorClassName="bg-blue-500 animate-pulse" />
          </div>
          
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Processing your data...</span>
            <span>Please wait</span>
          </div>
          
          {/* Stage indicators */}
          <div className="mt-5 flex items-center justify-between">
            {['queued', 'collecting', 'processing', 'exporting', 'completed'].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${
                  index === 1 ? 'bg-blue-500 animate-pulse' : 
                  index < 1 ? 'bg-blue-200' : 'bg-slate-200'
                }`}></div>
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Main content shimmer */}
      <Card className="overflow-hidden shadow-sm border">
        <CardHeader className="bg-slate-50 border-b p-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Info cards shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-4">
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
