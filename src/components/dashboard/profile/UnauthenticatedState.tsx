
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UnauthenticatedState() {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-xl">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-muted-foreground mb-4">
          You need to be signed in to view your profile.
        </div>
        <Button asChild>
          <a href="/auth">Sign In</a>
        </Button>
      </CardContent>
    </Card>
  );
}
