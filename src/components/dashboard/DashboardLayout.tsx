
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "./DashboardSidebar";
import { 
  SidebarProvider, 
  SidebarInset 
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
            <SidebarInset className="p-6">
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
}
