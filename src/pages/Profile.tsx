
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Mail, User, CreditCard, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account information and settings</p>
          </div>
          <Link to="/dashboard/billing">
            <Button variant="outline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="md:col-span-1 border border-border shadow-sm">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src="" alt={user?.email || "User"} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user?.email}</CardTitle>
              <CardDescription className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs inline-block mt-1">
                Free Plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="font-medium">{signupDate}</span>
                </div>
                <div className="pt-2">
                  <Link to="/settings">
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      App Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Settings - Using the updated ProfileSection component */}
          <div className="md:col-span-2">
            <ProfileSection />
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
