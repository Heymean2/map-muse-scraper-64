
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ProfileCardSkeletonProps {
  pulseEffect?: boolean;
}

export function ProfileCardSkeleton({ pulseEffect = false }: ProfileCardSkeletonProps) {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className={`h-16 w-16 rounded-full ${pulseEffect ? 'animate-pulse' : ''}`} />
          <div className="space-y-2">
            <Skeleton className={`h-6 w-40 ${pulseEffect ? 'animate-pulse' : ''}`} />
            <Skeleton className={`h-4 w-32 ${pulseEffect ? 'animate-pulse' : ''}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className={`h-20 w-full ${pulseEffect ? 'animate-pulse' : ''}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
