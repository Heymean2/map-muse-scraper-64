
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarRail
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Increased top padding from pt-16 to pt-20 to prevent navbar overlap */}
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
    </div>
  );
}
