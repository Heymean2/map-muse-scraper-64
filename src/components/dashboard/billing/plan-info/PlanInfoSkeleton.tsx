
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PlanInfoSkeletonProps {
  handleRefresh: () => void;
  isRefreshing: boolean;
}

export function PlanInfoSkeleton({ handleRefresh, isRefreshing }: PlanInfoSkeletonProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-center">
      <p className="text-muted-foreground">Loading plan information...</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
