
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Database, 
  UserCircle, 
  Lock,
  Home
} from "lucide-react";

interface NavigationItem {
  icon: React.ElementType;
  title: string;
  path: string;
  exact?: boolean;
  iconColor?: string;
}

export default function SettingsNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = React.useState("");
  
  React.useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return activePath === path;
  };
  
  // Navigation items - removed Language and Notifications
  const navigationItems: NavigationItem[] = [
    {
      icon: Home,
      title: "Overview",
      path: "/dashboard/settings",
      exact: true
    },
    {
      icon: UserCircle,
      title: "Account",
      path: "/dashboard/settings/account",
      iconColor: "bg-blue-50 text-blue-600"
    },
    {
      icon: Palette,
      title: "Appearance",
      path: "/dashboard/settings/appearance",
      iconColor: "bg-purple-50 text-purple-600"
    },
    {
      icon: Lock,
      title: "Security",
      path: "/dashboard/settings/security",
      iconColor: "bg-red-50 text-red-600"
    },
    {
      icon: Database,
      title: "Data & Privacy",
      path: "/dashboard/settings/data",
      iconColor: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "default" : "outline"}
          size="sm"
          onClick={() => navigate(item.path)}
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Button>
      ))}
    </div>
  );
}
