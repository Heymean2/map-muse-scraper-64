import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Save,
  Palette, 
  Bell, 
  Languages, 
  Database, 
  UserCircle, 
  Lock, 
  Settings as SettingsIcon
} from "lucide-react";

import PreferencesTab from "@/components/settings/PreferencesTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AccountTab from "@/components/settings/AccountTab";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preferences");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            
            <Button 
              onClick={handleSaveSettings} 
              className="flex items-center gap-2 ml-auto"
              size="sm"
            >
              <Save className="h-4 w-4" />
              Save All Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-3 space-y-4">
              <div className="sticky top-20">
                <Tabs 
                  defaultValue="preferences" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  orientation="vertical" 
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto w-full bg-card p-1 shadow-sm rounded-md">
                    <TabsTrigger 
                      value="preferences" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="language" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      Language & Region
                    </TabsTrigger>
                    <TabsTrigger 
                      value="data" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Data & Privacy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="account" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-9">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="preferences" className="mt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <Palette className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Appearance Settings</h2>
                    </div>
                    <PreferencesTab />
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <Bell className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Notification Preferences</h2>
                    </div>
                    <NotificationsTab />
                  </TabsContent>

                  <TabsContent value="language" className="mt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <Languages className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Language & Regional Settings</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Configure your language preferences and regional settings for date formats, currencies, and more.
                    </p>
                    {/* Language content placeholder - will be implemented in future */}
                  </TabsContent>

                  <TabsContent value="data" className="mt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <Database className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Data & Privacy Settings</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Manage your data, downloads, and privacy preferences.
                    </p>
                    {/* Data & Privacy content placeholder - will be implemented in future */}
                  </TabsContent>

                  <TabsContent value="account" className="mt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <UserCircle className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Account Settings</h2>
                    </div>
                    <AccountTab />
                  </TabsContent>

                  <TabsContent value="security" className="mt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <Lock className="h-5 w-5 text-primary mr-2" />
                      <h2 className="text-xl font-semibold">Security Settings</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Manage your account security, passwords, and authentication options.
                    </p>
                    {/* Security content placeholder - will be implemented in future */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
