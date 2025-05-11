
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";

export default function SidebarFooter() {
  const { user, signOut } = useAuth();
  
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo', user?.id],
    queryFn: getUserPlanInfo,
    enabled: !!user,
    staleTime: 60000 // Cache for 1 minute
  });
  
  return (
    <Footer className="p-4 mt-auto">
      <div className="space-y-3">
        <div 
          className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary-subtle flex items-center justify-center text-violet-primary">
            <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate max-w-[140px]">
              {user?.email || "User"}
            </span>
            <span className="text-xs text-muted-foreground">{planInfo?.planName || "Free Plan"}</span>
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
