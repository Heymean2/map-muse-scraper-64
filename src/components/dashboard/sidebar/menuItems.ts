
import { 
  FileText, 
  Search, 
  UserCircle, 
  CreditCard, 
  Settings,
  LayoutDashboard,
} from "lucide-react";

export interface SidebarMenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
  color: string;
  hoverBg: string;
  activeColor: string;
  onMouseEnter?: () => void;
}

export const createMenuItems = (handleBillingHover: () => void): SidebarMenuItem[] => {
  return [
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
};
