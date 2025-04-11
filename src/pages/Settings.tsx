import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Moon, Sun, Languages, LucideGlobe, Shield, Download, Trash2 } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false,
    updates: true,
    results: true
  });
  const [exportFormat, setExportFormat] = useState("csv");
  
  const handleSavePreferences = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Exporting data",
      description: "Your data is being exported. This may take a moment.",
    });
  };
  
  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email to confirm account deletion.",
      variant: "destructive"
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
            <TabsTrigger value="api">API Access</TabsTrigger>
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
                
                <Button onClick={handleSavePreferences}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for automated access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Your API Key</h3>
                      <p className="text-sm text-muted-foreground">
                        Use this key to access the API
                      </p>
                    </div>
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="relative">
                    <Input 
                      value="••••••••••••••••••••••••••••••" 
                      readOnly 
                      className="pr-24"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-1 top-1"
                      onClick={() => {
                        toast({
                          title: "API key copied",
                          description: "The API key has been copied to your clipboard."
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">API Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to use our API to automate your scraping tasks
                    </p>
                    <Button variant="outline">View Documentation</Button>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Regenerate API Key</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If your key is compromised, you can generate a new one. This will invalidate your old key.
                    </p>
                    <Button variant="destructive">Regenerate Key</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid gap-4 max-w-md">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" defaultValue="John Doe" className="col-span-3" />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" defaultValue="johndoe@example.com" className="col-span-3" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid gap-4 max-w-md">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="current-password" className="text-right">
                        Current
                      </Label>
                      <Input id="current-password" type="password" className="col-span-3" />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-password" className="text-right">
                        New
                      </Label>
                      <Input id="new-password" type="password" className="col-span-3" />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirm-password" className="text-right">
                        Confirm
                      </Label>
                      <Input id="confirm-password" type="password" className="col-span-3" />
                    </div>
                  </div>
                  
                  <Button>Update Password</Button>
                </div>
                
                <div className="border-t pt-4 space-y-4">
                  <h3 className="text-lg font-medium text-amber-500">Export & Delete</h3>
                  
                  <div className="flex items-start gap-4">
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export My Data
                    </Button>
                    
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deleting your account will remove all of your data and cannot be undone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
