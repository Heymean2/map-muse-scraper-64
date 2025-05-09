
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarRail
} from "@/components/ui/sidebar";

interface TaskDetailLayoutProps {
  children: ReactNode;
}

export default function TaskDetailLayout({ children }: TaskDetailLayoutProps) {
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16">
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-4rem)] w-full">
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
