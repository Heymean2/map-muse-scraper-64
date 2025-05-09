
import { ReactNode, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarRail
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { saveRoute, getLastRoute, isAuthRoute } from "@/services/routeMemory";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Save current route path when it changes
  useEffect(() => {
    if (!isAuthRoute(location.pathname)) {
      saveRoute(location.pathname);
    }
  }, [location.pathname]);

  // Only redirect if not loading and user is not authenticated
  if (!isLoading && !user) {
    // Store the current path to redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Show loading state or content */}
      {isLoading ? (
        <div className="flex-grow pt-20 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex-grow pt-20">
          <SidebarProvider>
            <div className="flex min-h-[calc(100vh-5rem)] w-full">
              <DashboardSidebar />
              <SidebarRail />
              <SidebarInset className="p-4 md:p-6 w-full">
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      )}
    </div>
  );
}
