
import { useEffect, useState } from "react";
import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { 
  Palette, 
  Bell, 
  Languages, 
  Database, 
  UserCircle, 
  Lock,
  Home,
  ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/Navbar";
import PreferencesTab from "@/components/settings/PreferencesTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AccountSettings from "@/components/settings/AccountSettings";
import SettingsCardsDashboard, { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState("");
  
  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Scroll to top when navigating to settings
  useEffect(() => {
    window.scrollTo(0, 0);
    setActivePath(location.pathname);
  }, [location.pathname]);
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return activePath === path;
  };
  
  // Navigation items
  const navigationItems = [
    {
      icon: Home,
      title: "Overview",
      path: "/dashboard/settings",
      exact: true
    },
    {
      icon: UserCircle,
      title: "Account",
      path: "/dashboard/settings/account",
      iconColor: "bg-blue-50 text-blue-600"
    },
    {
      icon: Palette,
      title: "Appearance",
      path: "/dashboard/settings/appearance",
      iconColor: "bg-purple-50 text-purple-600"
    },
    {
      icon: Bell,
      title: "Notifications",
      path: "/dashboard/settings/notifications",
      iconColor: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: Lock,
      title: "Security",
      path: "/dashboard/settings/security",
      iconColor: "bg-red-50 text-red-600"
    },
    {
      icon: Languages,
      title: "Language",
      path: "/dashboard/settings/language",
      iconColor: "bg-green-50 text-green-600"
    },
    {
      icon: Database,
      title: "Data & Privacy",
      path: "/dashboard/settings/data",
      iconColor: "bg-orange-50 text-orange-600"
    }
  ];

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-16">
        <Container className="py-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
              <Button
                variant="outline" 
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>

            {/* Navigation tabs */}
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "outline"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </div>

            <div className="mt-6">
              <Routes>
                <Route path="/" element={<SettingsCardsDashboard />} />
                
                <Route path="appearance" element={
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <Palette className="h-5 w-5 text-primary mr-2" />
                      <SettingsPageHeader title="Appearance Settings" showBackButton />
                    </div>
                    <PreferencesTab />
                  </Card>
                } />
                
                <Route path="notifications" element={
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <Bell className="h-5 w-5 text-primary mr-2" />
                      <SettingsPageHeader title="Notification Preferences" showBackButton />
                    </div>
                    <NotificationsTab />
                  </Card>
                } />
                
                <Route path="language" element={
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <Languages className="h-5 w-5 text-primary mr-2" />
                      <SettingsPageHeader title="Language & Regional Settings" showBackButton />
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Configure your language preferences and regional settings for date formats, currencies, and more.
                    </p>
                    
                    <div className="animate-fade-in">
                      <p className="text-muted-foreground">
                        Language settings content will be available in the next update.
                      </p>
                    </div>
                  </Card>
                } />
                
                <Route path="data" element={
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <Database className="h-5 w-5 text-primary mr-2" />
                      <SettingsPageHeader title="Data & Privacy Settings" showBackButton />
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Manage your data, downloads, and privacy preferences.
                    </p>
                    
                    <div className="animate-fade-in">
                      <p className="text-muted-foreground">
                        Data privacy settings content will be available in the next update.
                      </p>
                    </div>
                  </Card>
                } />
                
                <Route path="account" element={
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <UserCircle className="h-5 w-5 text-primary mr-2" />
                      <SettingsPageHeader title="Account Settings" showBackButton />
                    </div>
                    <AccountSettings />
                  </Card>
                } />
                
                <Route path="security" element={
                  <Card className="p-6">
                    <div className="flex items-center mb-6">
                      <Lock className="h-5 w-5 text-primary mr-2" />
                      <SettingsPageHeader title="Security Settings" showBackButton />
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Manage your account security, passwords, and authentication options.
                    </p>
                    
                    <div className="animate-fade-in">
                      <p className="text-muted-foreground">
                        Security settings content will be available in the next update.
                      </p>
                    </div>
                  </Card>
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
