
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function ProfileErrorState({ onRetry, message = "Could not load profile data. Please try again later." }: ErrorStateProps) {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-xl">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-muted-foreground mb-4">
          {message}
        </div>
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
