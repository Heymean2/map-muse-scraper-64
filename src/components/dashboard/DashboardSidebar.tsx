
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
  FileText, 
  Search, 
  UserCircle, 
  CreditCard, 
  Settings, 
  LogOut,
  User,
  LayoutDashboard,
  MapPin
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
    // Special case for dashboard home
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    // Special case for "New Scrape"
    if (path === "/dashboard/scrape" && location.pathname === "/dashboard/scrape") {
      return true;
    }
    // For other routes, check if the pathname starts with path but isn't exactly /dashboard
    return location.pathname !== "/dashboard" && location.pathname.startsWith(path);
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
      color: "text-violet-primary",
      hoverBg: "hover:bg-primary-subtle",
      activeColor: "group-data-[active=true]:text-violet-primary"
    },
    {
      title: "Results",
      icon: FileText,
      path: "/dashboard/results",
      color: "text-slate-600",
      hoverBg: "hover:bg-slate-50",
      activeColor: "group-data-[active=true]:text-violet-primary"
    },
    {
      title: "New Scrape",
      icon: Search,
      path: "/dashboard/scrape",
      color: "text-slate-600",
      hoverBg: "hover:bg-slate-50",
      activeColor: "group-data-[active=true]:text-violet-primary"
    },
    {
      title: "Profile",
      icon: UserCircle,
      path: "/dashboard/profile",
      color: "text-slate-600",
      hoverBg: "hover:bg-slate-50",
      activeColor: "group-data-[active=true]:text-violet-primary"
    },
    {
      title: "Billing",
      icon: CreditCard,
      path: "/dashboard/billing",
      color: "text-slate-600",
      hoverBg: "hover:bg-slate-50",
      activeColor: "group-data-[active=true]:text-violet-primary",
      onMouseEnter: handleBillingHover,
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
      color: "text-slate-600",
      hoverBg: "hover:bg-slate-50", 
      activeColor: "group-data-[active=true]:text-violet-primary"
    },
  ];

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-4 mt-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-violet-primary" />
          <Link to="/dashboard" className="text-xl font-semibold">
            MapScraper
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path} className="group">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.path)}
                  tooltip={item.title}
                  onMouseEnter={item.onMouseEnter}
                  className={`my-1.5 flex items-center justify-start transition-all duration-300 ${item.hoverBg} ${isActive(item.path) ? "bg-primary-subtle/60" : ""}`}
                >
                  <Link to={item.path} className="transition-colors flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-violet-primary" : item.color} transition-all duration-300 group-hover:scale-110`} />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 mt-auto">
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
      </SidebarFooter>
    </Sidebar>
  );
}
