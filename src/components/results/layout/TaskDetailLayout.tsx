
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

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
      <div className="flex flex-grow h-full pt-16">
        <div className="hidden md:block w-64 border-r bg-background shadow-sm">
          <DashboardSidebar />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
