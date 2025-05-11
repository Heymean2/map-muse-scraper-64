
import React from "react";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { SettingsPageHeader } from "@/components/settings/SettingsCardsDashboard";

export default function SecurityTab() {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Lock className="h-5 w-5 text-primary mr-2" />
        <SettingsPageHeader title="Security Settings" showBackButton />
      </div>
      <p className="text-muted-foreground mb-6">
        Manage your account security, passwords, and authentication options.
      </p>
      
      <div className="animate-fade-in">
        <ProfileSection />
      </div>
    </Card>
  );
}
