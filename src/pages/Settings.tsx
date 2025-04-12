
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Moon, Sun, Languages, LucideGlobe } from "lucide-react";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Json } from "@/integrations/supabase/types";

// Define the notification settings type for better type safety
interface NotificationSettings {
  email: boolean;
  desktop: boolean;
  updates: boolean;
  results: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    desktop: false,
    updates: true,
    results: true
  });
  const [exportFormat, setExportFormat] = useState("csv");
  
  // Save notification preferences to database
  const saveNotificationSettings = async () => {
    if (!user) return;
    
    try {
      // Convert NotificationSettings to a plain object that satisfies the Json type
      const notificationData = {
        email: notifications.email,
        desktop: notifications.desktop,
        updates: notifications.updates,
        results: notifications.results
      } as Json;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: notificationData
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated."
      });
    } catch (err) {
      console.error("Error saving notification settings:", err);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    }
  };
  
  // Load notification preferences from database
  const loadNotificationSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data?.notification_settings) {
        // Validate the notification settings object and ensure it has the expected structure
        const settings = data.notification_settings as any;
        const validatedSettings: NotificationSettings = {
          email: typeof settings.email === 'boolean' ? settings.email : true,
          desktop: typeof settings.desktop === 'boolean' ? settings.desktop : false,
          updates: typeof settings.updates === 'boolean' ? settings.updates : true,
          results: typeof settings.results === 'boolean' ? settings.results : true
        };
        
        setNotifications(validatedSettings);
      }
    } catch (err) {
      console.error("Error loading notification settings:", err);
    }
  };
  
  // Load notification settings on component mount
  useEffect(() => {
    loadNotificationSettings();
  }, [user]);
  
  const handleSavePreferences = () => {
    saveNotificationSettings();
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer ${theme === 'light' ? 'border-primary bg-primary/10' : 'hover:bg-accent'}`}
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="h-6 w-6 mb-2" />
                        <span>Light</span>
                      </div>
                      <div 
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer ${theme === 'dark' ? 'border-primary bg-primary/10' : 'hover:bg-accent'}`}
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="h-6 w-6 mb-2" />
                        <span>Dark</span>
                      </div>
                      <div 
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer ${theme === 'system' ? 'border-primary bg-primary/10' : 'hover:bg-accent'}`}
                        onClick={() => setTheme('system')}
                      >
                        <div className="flex h-6 w-6 mb-2">
                          <Sun className="h-6 w-6" />
                          <Moon className="h-6 w-6 ml-[-12px]" />
                        </div>
                        <span>System</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Language & Region</h3>
                    <div className="grid gap-4 max-w-md">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right col-span-1">
                          <Languages className="h-4 w-4 inline mr-1" />
                          Language
                        </Label>
                        <div className="col-span-3">
                          <Select defaultValue="en">
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right col-span-1">
                          <LucideGlobe className="h-4 w-4 inline mr-1" />
                          Region
                        </Label>
                        <div className="col-span-3">
                          <Select defaultValue="us">
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="eu">Europe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Export Format</h3>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="csv" 
                          value="csv" 
                          checked={exportFormat === "csv"}
                          onChange={() => setExportFormat("csv")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="csv">CSV</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="json" 
                          value="json" 
                          checked={exportFormat === "json"}
                          onChange={() => setExportFormat("json")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="json">JSON</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="excel" 
                          value="excel" 
                          checked={exportFormat === "excel"}
                          onChange={() => setExportFormat("excel")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="excel">Excel</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSavePreferences}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Methods</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notifications.email} 
                      onCheckedChange={(checked) => setNotifications(prev => ({...prev, email: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show browser notifications on desktop
                      </p>
                    </div>
                    <Switch 
                      id="desktop-notifications" 
                      checked={notifications.desktop} 
                      onCheckedChange={(checked) => setNotifications(prev => ({...prev, desktop: checked}))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Categories</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="updates-notifications">Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New features and improvements
                      </p>
                    </div>
                    <Switch 
                      id="updates-notifications" 
                      checked={notifications.updates} 
                      onCheckedChange={(checked) => setNotifications(prev => ({...prev, updates: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="results-notifications">Scraping Results</Label>
                      <p className="text-sm text-muted-foreground">
                        When your scraping tasks are complete
                      </p>
                    </div>
                    <Switch 
                      id="results-notifications" 
                      checked={notifications.results} 
                      onCheckedChange={(checked) => setNotifications(prev => ({...prev, results: checked}))}
                    />
                  </div>
                </div>
                
                <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
