
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

import ProfileSection from "@/components/dashboard/ProfileSection";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileDetails from "@/components/profile/ProfileDetails";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch user profile data from profiles table
  const { data: userProfile, isLoading, error, refetch } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Get user's plan info
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo', userProfile?.plan_id],
    queryFn: async () => {
      if (!userProfile?.plan_id) return { planName: 'Free Plan' };
      
      try {
        const { data, error } = await supabase
          .from('pricing_plans')
          .select('name')
          .eq('id', userProfile.plan_id)
          .single();
        
        if (error) throw error;
        return { planName: data?.name || 'Free Plan' };
      } catch (error) {
        console.error("Error fetching plan info:", error);
        return { planName: 'Free Plan' };
      }
    },
    enabled: !!userProfile?.plan_id
  });

  const handleProfileEditSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  if (error) {
    console.error("Error fetching profile:", error);
  }

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
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    Edit Profile
                  </CardTitle>
                  <CardDescription>
                    Update your personal and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileEditForm 
                    initialData={userProfile || undefined} 
                    onSuccess={handleProfileEditSuccess}
                  />
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProfileOverview
                  user={user}
                  userProfile={userProfile}
                  isLoading={isLoading}
                  planName={planInfo?.planName || "Free Plan"}
                />
                <ProfileDetails
                  userProfile={userProfile}
                  isLoading={isLoading}
                  onEdit={() => setIsEditing(true)}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="account">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
