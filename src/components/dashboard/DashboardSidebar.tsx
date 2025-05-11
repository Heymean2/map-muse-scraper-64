
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarMenu from "./sidebar/SidebarMenu";
import SidebarFooter from "./sidebar/SidebarFooter";
import useActivePath from "./sidebar/useActivePath";
import { createMenuItems } from "./sidebar/menuItems";

// Preload billing components with a robust approach
const preloadBillingComponents = () => {
  return import("@/components/dashboard/BillingSection")
    .then(() => console.log("Billing components preloaded successfully"))
    .catch(err => console.error("Error preloading billing components:", err));
};

export default function DashboardSidebar() {
  const [billingPreloaded, setBillingPreloaded] = useState(false);
  const { isActive } = useActivePath();
  
  // Handle billing hover preloading
  const handleBillingHover = () => {
    if (!billingPreloaded) {
      preloadBillingComponents().then(() => setBillingPreloaded(true));
    }
  };
  
  // Create menu items with the billing hover handler
  const menuItems = createMenuItems(handleBillingHover);
  
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

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader />
      <SidebarMenu menuItems={menuItems} isActive={isActive} />
      <SidebarFooter />
    </Sidebar>
  );
}
