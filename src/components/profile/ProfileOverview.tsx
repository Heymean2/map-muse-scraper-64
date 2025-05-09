
import { Link } from "react-router-dom";
import { CalendarDays, Mail, Settings, MapPin, Building } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileOverviewProps {
  user: any;
  userProfile: any;
  isLoading: boolean;
  planName: string;
}

export default function ProfileOverview({ 
  user, 
  userProfile, 
  isLoading, 
  planName 
}: ProfileOverviewProps) {
  // Calculate signup date based on user metadata
  const signupDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }) 
    : 'Unknown';

  return (
    <Card className="md:col-span-1 border border-border shadow-sm">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          {isLoading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.full_name || ""} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {userProfile?.full_name?.charAt(0).toUpperCase() || 
                 user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        
        {isLoading ? (
          <Skeleton className="h-6 w-32 mx-auto mb-1" />
        ) : (
          <CardTitle className="text-xl">
            {userProfile?.full_name || user?.email?.split('@')[0] || "User"}
          </CardTitle>
        )}
        
        <CardDescription className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs inline-block mt-1">
          {planName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{user?.email || "Not provided"}</span>
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
  );
}
