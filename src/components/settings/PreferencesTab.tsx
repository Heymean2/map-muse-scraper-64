
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Languages, LucideGlobe } from "lucide-react";

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
  );
}
