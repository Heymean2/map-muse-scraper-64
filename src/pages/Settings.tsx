
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Sun, Moon, Languages, LucideGlobe, 
  BellRing, Mail, Smartphone, Calendar,
  Save, Monitor, Palette, FileJson, Database,
  DownloadCloud, Bell, Languages as LanguagesIcon,
  Lock, UserCircle, KeyRound, Settings as SettingsIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [exportFormat, setExportFormat] = useState("csv");
  
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
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings saved",
      description: "Your display preferences have been updated."
    });
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your experience and preferences</p>
          </div>
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Settings Navigation Sidebar */}
          <Card className="col-span-12 md:col-span-3 border">
            <CardContent className="p-0">
              <Tabs defaultValue="appearance" orientation="vertical" className="w-full">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-2">
                  <TabsTrigger value="appearance" className="justify-start w-full">
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="language" className="justify-start w-full">
                    <LanguagesIcon className="h-4 w-4 mr-2" />
                    Language & Region
                  </TabsTrigger>
                  <TabsTrigger value="data" className="justify-start w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Data & Privacy
                  </TabsTrigger>
                  <TabsTrigger value="account" className="justify-start w-full">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Settings Content */}
          <Card className="col-span-12 md:col-span-9 border">
            <CardContent className="p-6">
              <Tabs defaultValue="appearance">
                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-primary" />
                      Display Settings
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Theme</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div 
                            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/10 shadow-sm' : 'hover:bg-accent'}`}
                            onClick={() => setTheme('light')}
                          >
                            <Sun className="h-8 w-8 mb-3 text-orange-500" />
                            <span className="font-medium">Light</span>
                            <span className="text-xs text-muted-foreground mt-1">For bright environments</span>
                          </div>
                          <div 
                            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/10 shadow-sm' : 'hover:bg-accent'}`}
                            onClick={() => setTheme('dark')}
                          >
                            <Moon className="h-8 w-8 mb-3 text-indigo-500" />
                            <span className="font-medium">Dark</span>
                            <span className="text-xs text-muted-foreground mt-1">Easier on the eyes</span>
                          </div>
                          <div 
                            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/10 shadow-sm' : 'hover:bg-accent'}`}
                            onClick={() => setTheme('system')}
                          >
                            <Monitor className="h-8 w-8 mb-3 text-sky-500" />
                            <span className="font-medium">System</span>
                            <span className="text-xs text-muted-foreground mt-1">Follows your device</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Data Export Format</h3>
                        <div className="flex space-x-4 items-center">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="csv" 
                              value="csv" 
                              checked={exportFormat === "csv"}
                              onChange={() => setExportFormat("csv")}
                              className="h-4 w-4 text-primary"
                            />
                            <Label htmlFor="csv" className="font-medium">CSV</Label>
                            <Badge variant="outline" className="ml-1">Default</Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="json" 
                              value="json" 
                              checked={exportFormat === "json"}
                              onChange={() => setExportFormat("json")}
                              className="h-4 w-4 text-primary"
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
                              className="h-4 w-4 text-primary"
                            />
                            <Label htmlFor="excel">Excel</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button onClick={handleSaveAppearance} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Appearance Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <BellRing className="h-5 w-5 mr-2 text-primary" />
                      Notification Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      <Card className="border-none shadow-none bg-muted/40">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Mail className="h-4 w-4 mr-2" /> 
                            Email Notifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
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
                          
                          <Separator />
                          
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
                          
                          <Separator />
                          
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
                      
                      <Card className="border-none shadow-none bg-muted/40">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" /> 
                            Push Notifications
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
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
                          
                          <Separator />
                          
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
                          
                          <Separator />
                          
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
                      
                      <div className="pt-2">
                        <Button className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Notification Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Language Tab */}
                <TabsContent value="language" className="space-y-6 mt-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-primary" />
                      Language & Regional Settings
                    </h2>
                    
                    <div className="grid gap-6 max-w-md">
                      <div>
                        <Label htmlFor="language" className="text-base font-medium flex items-center mb-2">
                          <Languages className="h-4 w-4 mr-2" />
                          Display Language
                        </Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language" className="w-full">
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
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose the language you want to use for the application interface.
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="region" className="text-base font-medium flex items-center mb-2">
                          <LucideGlobe className="h-4 w-4 mr-2" />
                          Region
                        </Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="region" className="w-full">
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
                        <p className="text-sm text-muted-foreground mt-1">
                          This affects date formats, currency, and other regional settings.
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="date-format" className="text-base font-medium flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date Format
                        </Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger id="date-format" className="w-full">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Language Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Data Tab */}
                <TabsContent value="data" className="space-y-6 mt-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-primary" />
                      Data & Privacy Settings
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Data Storage</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Control how long your data is stored in our system.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="store-results" className="font-medium">
                                Store Scraping Results
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Keep scraping results in your account
                              </p>
                            </div>
                            <Select defaultValue="90">
                              <SelectTrigger id="store-results" className="w-40">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="180">6 months</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="auto-download" className="font-medium">
                                Auto-Download Results
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically download scraping results when complete
                              </p>
                            </div>
                            <Switch id="auto-download" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-lg font-medium mb-3">Data Export</h3>
                        <Button variant="outline" className="flex items-center gap-2">
                          <DownloadCloud className="h-4 w-4" />
                          Export All Data
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Download all your data including scraping results and account information.
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Privacy Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6 mt-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <UserCircle className="h-5 w-5 mr-2 text-primary" />
                      Account Settings
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="account-email" className="text-base font-medium block mb-2">Email Address</Label>
                          <Input 
                            id="account-email" 
                            type="email" 
                            value={user?.email || ''}
                            readOnly 
                            className="bg-muted"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="display-name" className="text-base font-medium block mb-2">Display Name</Label>
                          <Input 
                            id="display-name" 
                            placeholder="Your name" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="profile-photo" className="text-base font-medium block mb-2">Profile Photo</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="h-8 w-8 text-primary" />
                          </div>
                          <Button variant="outline" size="sm">Change Photo</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6 mt-0">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-primary" />
                      Security Settings
                    </h2>
                    
                    <div className="space-y-6">
                      <Card className="border-none shadow-none bg-muted/40">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex items-center">
                            <KeyRound className="h-4 w-4 mr-2" /> 
                            Password
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            Change your password to keep your account secure.
                          </p>
                          <Button variant="outline">Change Password</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-none shadow-none bg-muted/40">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base flex items-center">
                            <SettingsIcon className="h-4 w-4 mr-2" /> 
                            Session Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            View and manage your active sessions on different devices.
                          </p>
                          <Button variant="outline">View Active Sessions</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Container>
    </DashboardLayout>
  );
}
