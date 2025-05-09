
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Navigate, Routes, Route } from "react-router-dom";
import { 
  Palette, 
  Bell, 
  Languages, 
  Database, 
  UserCircle, 
  Lock
} from "lucide-react";

import PreferencesTab from "@/components/settings/PreferencesTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AccountSettings from "@/components/settings/AccountSettings";
import SettingsCardsDashboard, { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";

export default function Settings() {
  // Scroll to top when navigating to settings
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <DashboardLayout>
      <div className="w-full max-w-full">
        <div className="space-y-6 pb-10 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Routes>
              <Route path="/" element={<SettingsCardsDashboard />} />
              
              <Route path="appearance" element={
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <Palette className="h-5 w-5 text-primary mr-2" />
                    <SettingsPageHeader title="Appearance Settings" showBackButton />
                  </div>
                  <PreferencesTab />
                </div>
              } />
              
              <Route path="notifications" element={
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <Bell className="h-5 w-5 text-primary mr-2" />
                    <SettingsPageHeader title="Notification Preferences" showBackButton />
                  </div>
                  <NotificationsTab />
                </div>
              } />
              
              <Route path="language" element={
                <div className="bg-card rounded-lg border shadow-sm p-6">
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
                </div>
              } />
              
              <Route path="data" element={
                <div className="bg-card rounded-lg border shadow-sm p-6">
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
                </div>
              } />
              
              <Route path="account" element={
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <UserCircle className="h-5 w-5 text-primary mr-2" />
                    <SettingsPageHeader title="Account Settings" showBackButton />
                  </div>
                  <AccountSettings />
                </div>
              } />
              
              <Route path="security" element={
                <div className="bg-card rounded-lg border shadow-sm p-6">
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
                </div>
              } />
              
              <Route path="" element={<Navigate to="/dashboard/settings" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
