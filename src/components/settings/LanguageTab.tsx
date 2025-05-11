
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";

export default function LanguageTab() {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Languages className="h-5 w-5 text-primary mr-2" />
        <SettingsPageHeader title="Language & Regional Settings" showBackButton />
      </div>
      <p className="text-muted-foreground mb-6">
        Configure your language preferences and regional settings for date formats, currencies, and more.
      </p>
      
      <div className="animate-fade-in space-y-6">
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Language Options</h3>
              <div className="grid gap-6 max-w-md">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-1">
                    <Languages className="h-4 w-4 inline mr-1" />
                    Interface
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="en-gb">English (UK)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
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
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="eu">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
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
              <h3 className="text-lg font-medium mb-4">Date & Time Format</h3>
              <div className="grid gap-6 max-w-md">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-1">
                    Date Format
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-1">
                    Time Format
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue="12h">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button className="mt-4">Save Language Preferences</Button>
      </div>
    </Card>
  );
}
