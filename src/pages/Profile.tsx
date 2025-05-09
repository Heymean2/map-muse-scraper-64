
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileSection from "@/components/dashboard/ProfileSection";

export default function Profile() {
  return (
    <DashboardLayout>
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account information and settings</p>
          </div>
          <Link to="/dashboard/billing">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
}
