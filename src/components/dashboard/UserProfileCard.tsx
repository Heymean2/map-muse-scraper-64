
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Import the new component files
import { ProfileCardSkeleton } from "./profile/ProfileCardSkeleton";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileDetails } from "./profile/ProfileDetails";
import { ProfileLoadingState } from "./profile/LoadingState";
import { ProfileErrorState } from "./profile/ErrorState";
import { UnauthenticatedState } from "./profile/UnauthenticatedState";

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
    billing_period: string;
    price_per_credit?: number;
  };
}

export default function UserProfileCard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loadingProgress, setLoadingProgress] = useState(0);
  
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
  
  // Simulate loading progress
  useEffect(() => {
    if (authLoading || (user && isLoading)) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else if (!isLoading) {
      setLoadingProgress(100);
    }
  }, [authLoading, isLoading, user]);

  if (authLoading) {
    return <ProfileLoadingState loadingProgress={loadingProgress} message="Authenticating..." />;
  }

  if (!user) {
    return <UnauthenticatedState />;
  }

  if (isLoading) {
    return <ProfileLoadingState loadingProgress={loadingProgress} message="Loading your profile..." />;
  }

  if (error || !profile) {
    return <ProfileErrorState onRetry={() => refetch()} />;
  }

  return (
    <Card className="border border-border shadow-sm overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20 pb-6">
        <ProfileHeader email={profile.email} createdAt={profile.created_at} />
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <ProfileDetails 
          plan={profile.plan}
          credits={profile.credits}
          totalRows={profile.total_rows}
          userId={profile.id}
        />
      </CardContent>
    </Card>
  );
}
