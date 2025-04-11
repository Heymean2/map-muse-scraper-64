
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "@/components/dashboard/ProfileSection";

export default function Profile() {
  const { user } = useAuth();
  
  // Calculate signup date based on user metadata
  const signupDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }) 
    : 'Unknown';

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={user?.email || "User"} />
                  <AvatarFallback className="text-2xl">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user?.email}</CardTitle>
              <CardDescription>Free Plan User</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-1">
                <div className="flex items-center text-sm gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Member since:</span>
                </div>
                <p className="text-sm">{signupDate}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Settings - Using the ProfileSection component */}
          <div className="md:col-span-2">
            <ProfileSection />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
