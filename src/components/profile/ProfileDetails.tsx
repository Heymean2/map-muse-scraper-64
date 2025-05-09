
import { User, UserCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileDetailsProps {
  userProfile: any;
  isLoading: boolean;
  onEdit: () => void;
}

export default function ProfileDetails({ userProfile, isLoading, onEdit }: ProfileDetailsProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </div>
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        <CardDescription>
          Your personal and professional information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : (
          <>
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
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
              <p className="font-medium whitespace-pre-line">{userProfile?.bio || "No bio provided"}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
