
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
