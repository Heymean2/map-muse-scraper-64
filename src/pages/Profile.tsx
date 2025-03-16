
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Mail, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
              <Button variant="outline" className="w-full">
                Update Photo
              </Button>
              <Separator />
              <div className="space-y-1">
                <div className="flex items-center text-sm gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Account ID:</span>
                </div>
                <p className="text-sm font-mono truncate">{user?.id}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Member since:</span>
                </div>
                <p className="text-sm">{signupDate}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Settings */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Email Address</h3>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>{user?.email}</span>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email is used for login and notifications
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Password</h3>
                <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Management</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="destructive">Delete Account</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Deleting your account is permanent and will remove all your data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </DashboardLayout>
  );
}
