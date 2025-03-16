
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
import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  UserCircle, 
  CreditCard, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function DashboardSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
      path: "/dashboard/profile",
    },
    {
      title: "Billing",
      icon: CreditCard,
      path: "/dashboard/billing",
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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate max-w-[140px]">
              {user?.email}
            </span>
            <span className="text-xs text-gray-500">Free Plan</span>
          </div>
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
                >
                  <Link to={item.path}>
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
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
