import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";
import { Label } from "@/components/ui/label";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function PreferencesTab() {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Palette className="h-5 w-5 text-primary mr-2" />
        <SettingsPageHeader title="Appearance Settings" showBackButton />
      </div>
      
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Customize the appearance of the application to suit your preferences.
        </p>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Theme Options</h3>
              <div className="grid gap-6 max-w-md">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-1">
                    Theme
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}
