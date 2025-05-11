
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Computer, Languages, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PreferencesTab() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [exportFormat, setExportFormat] = useState("csv");
  
  const handleSavePreferences = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-medium mb-5">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div 
              className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${theme === 'light' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setTheme('light')}
            >
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Sun className="h-8 w-8 text-amber-500" />
              </div>
              <span className="font-medium text-lg">Light</span>
              <span className="text-sm text-muted-foreground mt-2 text-center">For bright environments</span>
              
              {theme === 'light' && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
            
            <div 
              className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${theme === 'dark' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setTheme('dark')}
            >
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Moon className="h-8 w-8 text-indigo-500" />
              </div>
              <span className="font-medium text-lg">Dark</span>
              <span className="text-sm text-muted-foreground mt-2 text-center">Easier on the eyes</span>
              
              {theme === 'dark' && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
            
            <div 
              className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${theme === 'system' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setTheme('system')}
            >
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                <Computer className="h-8 w-8 text-sky-500" />
              </div>
              <span className="font-medium text-lg">System</span>
              <span className="text-sm text-muted-foreground mt-2 text-center">Follows your device</span>
              
              {theme === 'system' && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Card className="border shadow-sm mt-8">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Language & Region</h3>
              <div className="grid gap-6 max-w-md">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-1">
                    <Globe className="h-4 w-4 inline mr-1" />
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
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Export Format</h3>
              <div className="flex flex-wrap gap-5">
                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 hover:border-muted-foreground/30 ${exportFormat === "csv" ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => setExportFormat("csv")}
                >
                  <input 
                    type="radio" 
                    id="csv" 
                    value="csv" 
                    checked={exportFormat === "csv"}
                    onChange={() => setExportFormat("csv")}
                    className="h-4 w-4 text-primary cursor-pointer"
                  />
                  <div>
                    <Label htmlFor="csv" className="cursor-pointer font-medium">CSV</Label>
                    <p className="text-xs text-muted-foreground mt-1">Standard spreadsheet format</p>
                  </div>
                  {exportFormat === "csv" && <Badge variant="secondary" className="ml-2">Default</Badge>}
                </div>
                
                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 hover:border-muted-foreground/30 ${exportFormat === "json" ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => setExportFormat("json")}
                >
                  <input 
                    type="radio" 
                    id="json" 
                    value="json" 
                    checked={exportFormat === "json"}
                    onChange={() => setExportFormat("json")}
                    className="h-4 w-4 text-primary cursor-pointer"
                  />
                  <div>
                    <Label htmlFor="json" className="cursor-pointer font-medium">JSON</Label>
                    <p className="text-xs text-muted-foreground mt-1">Developer-friendly format</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button onClick={handleSavePreferences} className="flex items-center gap-2 mt-8">
        Save Preferences
      </Button>
    </div>
  );
}
