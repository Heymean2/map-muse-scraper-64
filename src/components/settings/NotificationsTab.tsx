
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Define the notification settings type for better type safety
interface NotificationSettings {
  email: boolean;
  desktop: boolean;
  updates: boolean;
  results: boolean;
}

export default function NotificationsTab() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    desktop: false,
    updates: true,
    results: true
  });
  
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
  
  return (
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
  );
}
