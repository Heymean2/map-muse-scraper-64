
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  plan_id?: number;
  total_rows?: number;
  credits?: number;
  plan?: {
    name: string;
    row_limit: number;
  };
}

export default function UserProfileCard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Fetch user profile data
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, plan:pricing_plans(*)')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error loading profile",
            description: "Could not fetch your profile information",
            variant: "destructive"
          });
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error("Profile fetch error:", err);
        throw err;
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    retry: 1
  });

  if (authLoading) {
    return <ProfileCardSkeleton />;
  }

  if (!user) {
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

  if (error || !profile) {
    return (
      <Card className="border border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="text-xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-muted-foreground mb-4">
            Could not load profile data. Please try again later.
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Get user initials for avatar fallback
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20 pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src="" alt={profile.email} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {getInitials(profile.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{profile.email}</CardTitle>
            <p className="text-muted-foreground text-sm">
              Member since {formatDate(profile.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Plan</h3>
            <p className="text-lg font-semibold">{profile.plan?.name || "Free Plan"}</p>
          </div>
          
          <div className="bg-muted/30 rounded-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Available Credits</h3>
            <p className="text-lg font-semibold">{profile.credits || 0}</p>
          </div>
          
          <div className="bg-muted/30 rounded-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Data Rows Used</h3>
            <p className="text-lg font-semibold">
              {profile.total_rows || 0} / {profile.plan?.row_limit || "∞"}
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">User ID</h3>
            <p className="text-sm font-mono truncate">{profile.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCardSkeleton() {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
