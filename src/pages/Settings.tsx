
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Bell, 
  Languages, 
  Database, 
  UserCircle, 
  Lock,
  Save
} from "lucide-react";

import PreferencesTab from "@/components/settings/PreferencesTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import AccountTab from "@/components/settings/AccountTab";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
        <div className="space-y-6 pb-10">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-20">
                <nav className="flex flex-col space-y-1">
                  <TabsList className="flex flex-col h-auto bg-card p-1 shadow-sm rounded-md">
                    <TabsTrigger 
                      value="preferences" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                      onClick={() => setActiveTab("preferences")}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="language" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                      onClick={() => setActiveTab("language")}
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      Language & Region
                    </TabsTrigger>
                    <TabsTrigger 
                      value="data" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                      onClick={() => setActiveTab("data")}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Data & Privacy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="account" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                      onClick={() => setActiveTab("account")}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start w-full py-3 px-4 data-[state=active]:bg-primary/10"
                      onClick={() => setActiveTab("security")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <TabsContent value="preferences" className={activeTab === "preferences" ? "block mt-0" : "hidden"}>
                  <div className="flex items-center mb-6">
                    <Palette className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Appearance Settings</h2>
                  </div>
                  <PreferencesTab />
                </TabsContent>

                <TabsContent value="notifications" className={activeTab === "notifications" ? "block mt-0" : "hidden"}>
                  <div className="flex items-center mb-6">
                    <Bell className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  </div>
                  <NotificationsTab />
                </TabsContent>

                <TabsContent value="language" className={activeTab === "language" ? "block mt-0" : "hidden"}>
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
                </TabsContent>

                <TabsContent value="data" className={activeTab === "data" ? "block mt-0" : "hidden"}>
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
                </TabsContent>

                <TabsContent value="account" className={activeTab === "account" ? "block mt-0" : "hidden"}>
                  <div className="flex items-center mb-6">
                    <UserCircle className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Account Settings</h2>
                  </div>
                  <AccountTab />
                </TabsContent>

                <TabsContent value="security" className={activeTab === "security" ? "block mt-0" : "hidden"}>
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
                </TabsContent>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
}
