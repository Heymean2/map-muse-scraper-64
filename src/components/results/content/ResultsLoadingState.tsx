
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoadingState() {
  return (
    <div className="space-y-4 bg-white rounded-lg border p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      
      <div className="mt-8">
        <Skeleton className="h-10 w-full max-w-md mb-8" />
        <Skeleton className="h-64 w-full mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
