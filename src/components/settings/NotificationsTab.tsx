
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Bell } from "lucide-react";
import { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";

export default function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState({
    results: true,
    updates: false,
    marketing: false
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    results: false,
    updates: true,
    failedTasks: true
  });
  
  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Bell className="h-5 w-5 text-primary mr-2" />
        <SettingsPageHeader title="Notification Preferences" showBackButton />
      </div>
      
      <p className="text-muted-foreground mb-6">
        Configure how and when you receive notifications from the application.
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email-results" className="font-medium">
                  Scraping Results
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your scraping tasks are complete
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-results" 
                  checked={emailNotifications.results} 
                  onCheckedChange={() => handleEmailToggle('results')} 
                />
                <Label htmlFor="email-results" className="cursor-pointer">
                  {emailNotifications.results ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email-updates" className="font-medium">
                  Product Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new features and improvements
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-updates" 
                  checked={emailNotifications.updates} 
                  onCheckedChange={() => handleEmailToggle('updates')} 
                />
                <Label htmlFor="email-updates" className="cursor-pointer">
                  {emailNotifications.updates ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email-marketing" className="font-medium">
                  Marketing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive marketing communications and special offers
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-marketing" 
                  checked={emailNotifications.marketing} 
                  onCheckedChange={() => handleEmailToggle('marketing')} 
                />
                <Label htmlFor="email-marketing" className="cursor-pointer">
                  {emailNotifications.marketing ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="push-results" className="font-medium">
                  Scraping Results
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your scraping tasks are complete
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="push-results" 
                  checked={pushNotifications.results} 
                  onCheckedChange={() => handlePushToggle('results')} 
                />
                <Label htmlFor="push-results" className="cursor-pointer">
                  {pushNotifications.results ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="push-updates" className="font-medium">
                  Product Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new features and improvements
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="push-updates" 
                  checked={pushNotifications.updates} 
                  onCheckedChange={() => handlePushToggle('updates')} 
                />
                <Label htmlFor="push-updates" className="cursor-pointer">
                  {pushNotifications.updates ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="push-failed" className="font-medium">
                  Failed Tasks
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a task fails or encounters an error
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="push-failed" 
                  checked={pushNotifications.failedTasks} 
                  onCheckedChange={() => handlePushToggle('failedTasks')} 
                />
                <Label htmlFor="push-failed" className="cursor-pointer">
                  {pushNotifications.failedTasks ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}
