
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
      className="max-w-5xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Header skeleton */}
      <div className="space-y-5 mb-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div>
          <Skeleton className="h-10 w-80 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-60" />
        </div>
      </div>

      {/* Progress Card */}
      <Card className="overflow-hidden border shadow-sm rounded-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/30 animate-pulse"></div>
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-5 w-32" />
          </div>
          
          {/* Loading progress bar */}
          <div className="mb-5">
            <Progress value={45} className="h-3 rounded-full" />
          </div>
          
          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>Loading your data...</span>
            <span>Please wait</span>
          </div>
          
          {/* Stage indicators */}
          <div className="mt-8 flex items-center justify-between">
            {['queued', 'collecting', 'processing', 'exporting', 'completed'].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full ${
                  index === 1 ? 'bg-blue-500/50 animate-pulse' : 
                  index < 1 ? 'bg-blue-200' : 'bg-slate-200'
                }`}></div>
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Main content shimmer */}
      <Card className="overflow-hidden shadow-sm border rounded-xl">
        <CardContent className="p-8">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-7 w-48 mb-4" />
            
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Info cards shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-xl">
            <CardContent className="p-8">
              <Skeleton className="h-7 w-36 mb-6" />
              <div className="space-y-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-40" />
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
