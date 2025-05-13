
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
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Header skeleton */}
      <div className="space-y-6 mb-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-10 w-1/2 mb-3 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-28 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-6 w-60 rounded-lg" />
        </div>
      </div>

      {/* Progress Card */}
      <Card className="overflow-hidden border-0 shadow-sm rounded-2xl bg-gradient-to-b from-white to-slate-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 animate-pulse"></div>
              <Skeleton className="h-6 w-40 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          
          {/* Loading progress bar */}
          <div className="mb-5">
            <Progress value={45} className="h-4 rounded-full" indicatorClassName="bg-blue-500 animate-pulse rounded-full" />
          </div>
          
          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>Loading your data...</span>
            <span>Please wait</span>
          </div>
          
          {/* Stage indicators */}
          <div className="mt-8 flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full ${
                  index === 1 ? 'bg-blue-500/50 animate-pulse' : 
                  index < 1 ? 'bg-blue-200' : 'bg-slate-200'
                }`}></div>
                <Skeleton className="h-4 w-20 mt-2 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Main content shimmer */}
      <Card className="overflow-hidden shadow-sm border-0 rounded-2xl bg-gradient-to-b from-white to-slate-50">
        <CardContent className="p-8">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-7 w-48 mb-4 rounded-lg" />
            
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-5 w-48 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Info cards shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {[1, 2].map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-2xl border-0 shadow-sm bg-gradient-to-b from-white to-slate-50">
            <CardContent className="p-8">
              <Skeleton className="h-7 w-36 mb-6 rounded-lg" />
              <div className="space-y-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-5 w-28 rounded-lg" />
                    <Skeleton className="h-5 w-40 rounded-lg" />
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
