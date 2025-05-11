
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SidebarFooter() {
  const { user, signOut, userDetails } = useAuth();
  
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo', user?.id],
    queryFn: getUserPlanInfo,
    enabled: !!user,
    staleTime: 60000 // Cache for 1 minute
  });

  // Get user initials for avatar fallback
  const getInitials = (email: string | undefined) => {
    return email ? email.substring(0, 2).toUpperCase() : "US";
  };
  
  return (
    <Footer className="p-4 mt-auto">
      <div className="space-y-3">
        <div 
          className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="flex-shrink-0">
            {userDetails?.avatarUrl ? (
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={userDetails.avatarUrl} alt={user?.email || "User"} />
                <AvatarFallback className="bg-primary-subtle text-violet-primary">
                  {getInitials(user?.email)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-subtle flex items-center justify-center text-violet-primary">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate max-w-[140px]">
              {userDetails?.displayName || user?.email || "User"}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {planInfo?.planName || "Free Plan"}
              {userDetails?.provider === 'google' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  Google
                </span>
              )}
            </span>
          </div>
        </div>
        <Separator />
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-2 justify-center border-slate-200 hover:bg-slate-50 hover:text-google-red hover:border-red-100 transition-colors"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </Footer>
  );
}
