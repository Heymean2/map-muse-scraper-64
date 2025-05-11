
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
  ArrowLeft,
  Globe
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/Navbar";
import PreferencesTab from "@/components/settings/PreferencesTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AccountSettings from "@/components/settings/AccountSettings";
import SettingsCardsDashboard, { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

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
                    
                    <div className="animate-fade-in space-y-6">
                      <Card className="border shadow-sm">
                        <CardContent className="pt-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Language Options</h3>
                            <div className="grid gap-6 max-w-md">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right col-span-1">
                                  <Languages className="h-4 w-4 inline mr-1" />
                                  Interface
                                </Label>
                                <div className="col-span-3">
                                  <Select defaultValue="en">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="en">English (US)</SelectItem>
                                      <SelectItem value="en-gb">English (UK)</SelectItem>
                                      <SelectItem value="es">Español</SelectItem>
                                      <SelectItem value="fr">Français</SelectItem>
                                      <SelectItem value="de">Deutsch</SelectItem>
                                      <SelectItem value="zh">中文</SelectItem>
                                      <SelectItem value="ja">日本語</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right col-span-1">
                                  <Globe className="h-4 w-4 inline mr-1" />
                                  Region
                                </Label>
                                <div className="col-span-3">
                                  <Select defaultValue="us">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="us">United States</SelectItem>
                                      <SelectItem value="ca">Canada</SelectItem>
                                      <SelectItem value="uk">United Kingdom</SelectItem>
                                      <SelectItem value="au">Australia</SelectItem>
                                      <SelectItem value="eu">Europe</SelectItem>
                                      <SelectItem value="asia">Asia</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border shadow-sm">
                        <CardContent className="pt-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Date & Time Format</h3>
                            <div className="grid gap-6 max-w-md">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right col-span-1">
                                  Date Format
                                </Label>
                                <div className="col-span-3">
                                  <Select defaultValue="mdy">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right col-span-1">
                                  Time Format
                                </Label>
                                <div className="col-span-3">
                                  <Select defaultValue="12h">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                                      <SelectItem value="24h">24-hour</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Button className="mt-4">Save Language Preferences</Button>
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
                    
                    <div className="animate-fade-in space-y-6">
                      <Card className="border shadow-sm">
                        <CardContent className="pt-6 space-y-4">
                          <h3 className="text-lg font-medium">Legal Documents</h3>
                          <p className="text-muted-foreground">
                            By using our Google Maps Scraper tool, you agree to our privacy policy and terms of service.
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to="/page/privacy-policy">Privacy Policy</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to="/page/terms-of-service">Terms of Service</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border shadow-sm">
                        <CardContent className="pt-6 space-y-4">
                          <h3 className="text-lg font-medium">Data Management</h3>
                          <p className="text-muted-foreground">
                            Control how your data is stored and processed on our platform.
                          </p>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Download Your Data</h4>
                                <p className="text-sm text-muted-foreground">Get a copy of all your data and scraping history</p>
                              </div>
                              <Button variant="outline" size="sm">Export Data</Button>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Delete Account</h4>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
                              </div>
                              <Button variant="destructive" size="sm">Delete Account</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
                      <ProfileSection />
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
