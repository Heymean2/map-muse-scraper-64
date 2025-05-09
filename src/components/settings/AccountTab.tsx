
import ProfileSection from "@/components/dashboard/ProfileSection";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, Lock, Bell, Globe, Database, Shield } from "lucide-react";

export default function AccountTab() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full mb-8">
          <TabsTrigger value="account" className="flex items-center gap-1.5">
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1.5">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-1.5">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <ProfileSection />
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> 
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your security preferences and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Security settings content will appear here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> 
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification preferences will appear here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> 
                Language & Region
              </CardTitle>
              <CardDescription>
                Customize your language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Language settings will appear here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" /> 
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your data, exports, and account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Data management options will appear here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> 
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your privacy preferences and data sharing options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Privacy settings will appear here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
