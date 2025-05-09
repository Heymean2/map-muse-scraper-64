
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-grow pt-16">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
