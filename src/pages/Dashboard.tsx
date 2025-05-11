
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScraperForm from "@/components/ScraperForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";
import Profile from "@/pages/Profile";
import Results from "@/pages/Results";
import DashboardHome from "@/components/dashboard/home/DashboardHome";

export default function Dashboard() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/scrape" element={<ScraperForm />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results/*" element={<Results />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
