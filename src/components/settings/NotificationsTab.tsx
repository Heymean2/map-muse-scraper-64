
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-results" className="font-medium">
                Scraping Results
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your scraping tasks are complete
              </p>
            </div>
            <Switch 
              id="email-results" 
              checked={emailNotifications.results} 
              onCheckedChange={() => handleEmailToggle('results')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-updates" className="font-medium">
                Product Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new features and improvements
              </p>
            </div>
            <Switch 
              id="email-updates" 
              checked={emailNotifications.updates} 
              onCheckedChange={() => handleEmailToggle('updates')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-marketing" className="font-medium">
                Marketing
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive marketing communications and special offers
              </p>
            </div>
            <Switch 
              id="email-marketing" 
              checked={emailNotifications.marketing} 
              onCheckedChange={() => handleEmailToggle('marketing')} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-results" className="font-medium">
                Scraping Results
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your scraping tasks are complete
              </p>
            </div>
            <Switch 
              id="push-results" 
              checked={pushNotifications.results} 
              onCheckedChange={() => handlePushToggle('results')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-updates" className="font-medium">
                Product Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new features and improvements
              </p>
            </div>
            <Switch 
              id="push-updates" 
              checked={pushNotifications.updates} 
              onCheckedChange={() => handlePushToggle('updates')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-failed" className="font-medium">
                Failed Tasks
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a task fails or encounters an error
              </p>
            </div>
            <Switch 
              id="push-failed" 
              checked={pushNotifications.failedTasks} 
              onCheckedChange={() => handlePushToggle('failedTasks')} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
