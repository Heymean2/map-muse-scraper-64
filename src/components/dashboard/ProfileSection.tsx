
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileSection() {
  const { user } = useAuth();

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Email: {user?.email}</p>
          
          <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
            User profile management functionality coming soon!
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
