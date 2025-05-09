
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  UserCircle, 
  CreditCard, 
  Settings, 
  LogOut,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getUserPlanInfo } from "@/services/scraper";

// Preload billing components with a robust approach
const preloadBillingComponents = () => {
  return import("@/components/dashboard/BillingSection")
    .then(() => console.log("Billing components preloaded successfully"))
    .catch(err => console.error("Error preloading billing components:", err));
};

export default function DashboardSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [billingPreloaded, setBillingPreloaded] = useState(false);
  
  const { data: planInfo } = useQuery({
    queryKey: ['userPlanInfo', user?.id],
    queryFn: getUserPlanInfo,
    enabled: !!user,
    staleTime: 60000 // Cache for 1 minute
  });
  
  // Preload billing components when dashboard loads
  useEffect(() => {
    if (!billingPreloaded) {
      // Use requestIdleCallback for better performance if available
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          preloadBillingComponents().then(() => setBillingPreloaded(true));
        });
      } else {
        // Fallback to setTimeout
        setTimeout(() => {
          preloadBillingComponents().then(() => setBillingPreloaded(true));
        }, 1000);
      }
    }
  }, [billingPreloaded]);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  const handleBillingHover = () => {
    if (!billingPreloaded) {
      preloadBillingComponents().then(() => setBillingPreloaded(true));
    }
  };
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Results",
      icon: FileText,
      path: "/result",
    },
    {
      title: "New Scrape",
      icon: Search,
      path: "/dashboard/scrape",
    },
    {
      title: "Profile",
      icon: UserCircle,
      path: "/profile", 
    },
    {
      title: "Billing",
      icon: CreditCard,
      path: "/dashboard/billing",
      onMouseEnter: handleBillingHover,
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          {/* Empty header as requested */}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.path)}
                  tooltip={item.title}
                  onMouseEnter={item.onMouseEnter}
                >
                  <Link to={item.path} className="transition-colors">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <div 
            className="flex items-center space-x-2 p-3 bg-muted/80 rounded-lg cursor-pointer hover:bg-muted transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
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
            className="w-full flex items-center gap-2"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
