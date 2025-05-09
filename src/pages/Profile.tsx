
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Mail, User, CreditCard, Settings, MapPin, Building, UserCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Calculate signup date based on user metadata
  const signupDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }) 
    : 'Unknown';

  // Fetch user profile data from profiles table
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data && !error) {
        setUserProfile(data);
      } else {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchUserProfile();
  }, [user?.id]);

  // Get user's plan info
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo'],
    queryFn: async () => {
      if (!userProfile?.plan_id) return { planName: 'Free Plan' };
      
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('name')
        .eq('id', userProfile.plan_id)
        .single();
      
      if (error) throw error;
      return { planName: data?.name || 'Free Plan' };
    },
    enabled: !!userProfile?.plan_id
  });

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
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Overview Card */}
              <Card className="md:col-span-1 border border-border shadow-sm">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                      <AvatarImage src={userProfile?.avatar_url || ""} alt={user?.email || "User"} />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {userProfile?.full_name || user?.email?.split('@')[0] || "User"}
                  </CardTitle>
                  <CardDescription className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs inline-block mt-1">
                    {planInfo?.planName || "Free Plan"}
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
                    {userProfile?.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Company:</span>
                        <span className="font-medium">{userProfile.company}</span>
                      </div>
                    )}
                    {userProfile?.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{userProfile.location}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <Link to="/dashboard/settings">
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          App Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Profile Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your personal and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                      <p className="font-medium">{userProfile?.full_name || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Title</h3>
                      <p className="font-medium">{userProfile?.job_title || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
                      <p className="font-medium">{userProfile?.company || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                      <p className="font-medium">{userProfile?.location || "Not provided"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                      <p className="font-medium">{userProfile?.bio || "No bio provided"}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-4">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile Information
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
