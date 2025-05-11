
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";

export default function DataPrivacyTab() {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Database className="h-5 w-5 text-primary mr-2" />
        <SettingsPageHeader title="Data & Privacy Settings" showBackButton />
      </div>
      <p className="text-muted-foreground mb-6">
        Manage your data, downloads, and privacy preferences.
      </p>
      
      <div className="animate-fade-in space-y-6">
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium">Legal Documents</h3>
            <p className="text-muted-foreground">
              By using our Google Maps Scraper tool, you agree to our privacy policy and terms of service.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/page/privacy-policy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/page/terms-of-service">Terms of Service</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium">Data Management</h3>
            <p className="text-muted-foreground">
              Control how your data is stored and processed on our platform.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Download Your Data</h4>
                  <p className="text-sm text-muted-foreground">Get a copy of all your data and scraping history</p>
                </div>
                <Button variant="outline" size="sm">Export Data</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}
