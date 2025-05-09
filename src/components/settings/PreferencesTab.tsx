
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Computer, Languages, LucideGlobe } from "lucide-react";
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
          <h3 className="text-lg font-medium mb-3">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted ${theme === 'light' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setTheme('light')}
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <Sun className="h-7 w-7 text-amber-500" />
              </div>
              <span className="font-medium text-lg">Light</span>
              <span className="text-sm text-muted-foreground mt-1">For bright environments</span>
            </div>
            
            <div 
              className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted ${theme === 'dark' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setTheme('dark')}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <Moon className="h-7 w-7 text-indigo-500" />
              </div>
              <span className="font-medium text-lg">Dark</span>
              <span className="text-sm text-muted-foreground mt-1">Easier on the eyes</span>
            </div>
            
            <div 
              className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted ${theme === 'system' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border'}`}
              onClick={() => setTheme('system')}
            >
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-3">
                <Computer className="h-7 w-7 text-sky-500" />
              </div>
              <span className="font-medium text-lg">System</span>
              <span className="text-sm text-muted-foreground mt-1">Follows your device</span>
            </div>
          </div>
        </div>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Language & Region</h3>
              <div className="grid gap-6 max-w-md">
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
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Export Format</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="csv" 
                    value="csv" 
                    checked={exportFormat === "csv"}
                    onChange={() => setExportFormat("csv")}
                    className="h-4 w-4 text-primary cursor-pointer"
                  />
                  <Label htmlFor="csv" className="cursor-pointer font-medium">CSV</Label>
                  <Badge variant="outline" className="ml-1">Default</Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="json" 
                    value="json" 
                    checked={exportFormat === "json"}
                    onChange={() => setExportFormat("json")}
                    className="h-4 w-4 text-primary cursor-pointer"
                  />
                  <Label htmlFor="json" className="cursor-pointer">JSON</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="excel" 
                    value="excel" 
                    checked={exportFormat === "excel"}
                    onChange={() => setExportFormat("excel")}
                    className="h-4 w-4 text-primary cursor-pointer"
                  />
                  <Label htmlFor="excel" className="cursor-pointer">Excel</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button onClick={handleSavePreferences} className="flex items-center gap-2">
        Save Preferences
      </Button>
    </div>
  );
}
