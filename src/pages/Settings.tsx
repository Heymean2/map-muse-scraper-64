
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Navigate, Routes, Route, NavLink, useLocation } from "react-router-dom";
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
import { cn } from "@/lib/utils";

export default function Settings() {
  const location = useLocation();
  
  return (
    <DashboardLayout>
      <Container>
        <div className="space-y-6 pb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Settings Sidebar */}
            <div className="lg:col-span-3">
              <div className="sticky top-20">
                <nav className="flex flex-col space-y-1">
                  <div className="flex flex-col bg-card p-1 shadow-sm rounded-md border">
                    <NavLink 
                      to="/dashboard/settings/appearance" 
                      className={({ isActive }) => cn(
                        "flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </NavLink>
                    <NavLink 
                      to="/dashboard/settings/notifications" 
                      className={({ isActive }) => cn(
                        "flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </NavLink>
                    <NavLink 
                      to="/dashboard/settings/language" 
                      className={({ isActive }) => cn(
                        "flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      Language & Region
                    </NavLink>
                    <NavLink 
                      to="/dashboard/settings/data" 
                      className={({ isActive }) => cn(
                        "flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Data & Privacy
                    </NavLink>
                    <NavLink 
                      to="/dashboard/settings/account" 
                      className={({ isActive }) => cn(
                        "flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Account
                    </NavLink>
                    <NavLink 
                      to="/dashboard/settings/security" 
                      className={({ isActive }) => cn(
                        "flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </NavLink>
                  </div>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <Routes>
                  <Route path="appearance" element={
                    <div>
                      <div className="flex items-center mb-6">
                        <Palette className="h-5 w-5 text-primary mr-2" />
                        <h2 className="text-xl font-semibold">Appearance Settings</h2>
                      </div>
                      <PreferencesTab />
                    </div>
                  } />
                  <Route path="notifications" element={
                    <div>
                      <div className="flex items-center mb-6">
                        <Bell className="h-5 w-5 text-primary mr-2" />
                        <h2 className="text-xl font-semibold">Notification Preferences</h2>
                      </div>
                      <NotificationsTab />
                    </div>
                  } />
                  <Route path="language" element={
                    <div>
                      <div className="flex items-center mb-6">
                        <Languages className="h-5 w-5 text-primary mr-2" />
                        <h2 className="text-xl font-semibold">Language & Regional Settings</h2>
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
                    <div>
                      <div className="flex items-center mb-6">
                        <Database className="h-5 w-5 text-primary mr-2" />
                        <h2 className="text-xl font-semibold">Data & Privacy Settings</h2>
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
                    <div>
                      <div className="flex items-center mb-6">
                        <UserCircle className="h-5 w-5 text-primary mr-2" />
                        <h2 className="text-xl font-semibold">Account Settings</h2>
                      </div>
                      <AccountSettings />
                    </div>
                  } />
                  <Route path="security" element={
                    <div>
                      <div className="flex items-center mb-6">
                        <Lock className="h-5 w-5 text-primary mr-2" />
                        <h2 className="text-xl font-semibold">Security Settings</h2>
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
                  <Route path="" element={<Navigate to="/dashboard/settings/appearance" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
