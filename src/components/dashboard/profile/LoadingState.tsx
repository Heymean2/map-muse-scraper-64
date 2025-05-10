
import { ProfileCardSkeleton } from "./ProfileCardSkeleton";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";

interface LoadingStateProps {
  loadingProgress: number;
  message: string;
}

export function ProfileLoadingState({ loadingProgress, message }: LoadingStateProps) {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-xl">User Profile</CardTitle>
        <Progress value={loadingProgress} className="h-1 mt-2" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <ProfileCardSkeleton pulseEffect={true} />
      </CardContent>
    </Card>
  );
}
