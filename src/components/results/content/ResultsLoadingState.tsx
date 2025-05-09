
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoadingState() {
  return (
    <div className="space-y-8 rounded-lg border p-6 shadow-sm bg-white">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      
      {/* Search section */}
      <div>
        <Skeleton className="h-10 w-full max-w-md mb-8 rounded-md" />
      </div>
      
      {/* Content section */}
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-md" />
        
        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        
        {/* Filter chips */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
