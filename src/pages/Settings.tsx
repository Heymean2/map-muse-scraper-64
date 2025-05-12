
import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

// Import our component files
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsNavigation from "@/components/settings/SettingsNavigation";
import SettingsCardsDashboard from "@/components/settings/SettingsCardsDashboard";
import PreferencesTab from "@/components/settings/PreferencesTab";
import AccountSettings from "@/components/settings/AccountSettings";
import SecurityTab from "@/components/settings/SecurityTab";
import DataPrivacyTab from "@/components/settings/DataPrivacyTab";

export default function Settings() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Scroll to top when navigating to settings
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-16">
        <Container className="py-8">
          <div className="space-y-6">
            <SettingsHeader />
            <SettingsNavigation />

            <div className="mt-6">
              <Routes>
                <Route path="/" element={<SettingsCardsDashboard />} />
                
                <Route path="appearance" element={
                  <PreferencesTab />
                } />
                
                <Route path="data" element={
                  <DataPrivacyTab />
                } />
                
                <Route path="account" element={
                  <Card className="p-6">
                    <AccountSettings />
                  </Card>
                } />
                
                <Route path="security" element={
                  <SecurityTab />
                } />
                
                <Route path="" element={<Navigate to="/dashboard/settings" replace />} />
              </Routes>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
